"use server";
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { MongoClient, ObjectId } from "mongodb";

export async function login(formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const server = process.env.WHMCS_SERVER;

  try {
    await signIn("credentials", {
      redirect: false,
      username,
      password,
      server,
    });
    return { success: true };
  } catch (error) {
    let message =
      "Something went wrong. Please check your credentials and try again. If problem persists, contact server admin.";
    if (error.message.includes("invalidadmin")) {
      message =
        "Something went wrong with your server connection. Please contact server admin.";
    }

    if (
      error.message.includes("connectionerror") ||
      error.message.includes("MongoServerError")
    ) {
      message =
        "Unable to connect to the database. Please check your credentials and try again.";
    }

    return { success: false, message };
  }
}

export async function logout() {
  revalidatePath("/");
  await signOut({ redirectTo: "/" });
}

export async function createDb(dbname, dbuser, password) {
  const session = await auth();
  let client = null;

  try {
    if (!session) {
      throw new Error("Not authenticated");
    }

    const { username } = session.user;

    if (!dbname || !dbuser || !password) {
      throw new Error(
        "Missing required parameters: dbname, dbuser, or password."
      );
    }

    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();
    const db = client.db("admin");

    const [databasesInfo, usersInfo] = await Promise.all([
      db.command({ listDatabases: 1 }),
      db.command({ usersInfo: { forAllDBs: true } }),
    ]);

    const databases = databasesInfo.databases.map((db) => db.name);
    const users = usersInfo.users.map((user) => ({
      username: user.user,
      dbs: user.roles.map((role) => role.db),
    }));

    const newDbName = `${username}_${dbname}`;
    const newDbUser = `${username}_${dbuser}`;

    if (databases.includes(newDbName)) {
      throw new Error(`Database "${newDbName}" already exists.`);
    }

    const userExists = users.some((user) => user.username === newDbUser);

    if (userExists) {
      throw new Error(`User "${newDbUser}" already exists.`);
    }

    await db.command({
      createUser: newDbUser,
      pwd: password,
      roles: [{ role: "readWrite", db: newDbName }],
    });

    const newDb = client.db(newDbName);
    await newDb.createCollection("test");

    revalidatePath("/");

    return {
      success: true,
      message: `Database "${newDbName}" and user "${newDbUser}" created successfully.`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function getDbs() {
  const session = await auth();
  let client = null;
  try {
    if (!session) {
      throw new Error("Not authenticated");
    }
    const { username } = session.user;

    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();
    const db = client.db("admin");

    const usersInfo = await db.command({
      usersInfo: { forAllDBs: true },
    });

    const userDbs = usersInfo.users.filter((user) =>
      user.user.includes(username)
    );

    const dbs = userDbs.flatMap((db) =>
      db.roles.map((role) => ({
        dbname: role.db,
        dbuser: db.user,
      }))
    );

    const data = await JSON.parse(JSON.stringify(dbs));

    return data;
  } catch (error) {
    return null;
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function updateDb(dbuser, password) {
  const session = await auth();
  let client = null;
  try {
    if (!session) {
      throw new Error("Not authenticated");
    }

    if (password.trim() === "") {
      throw new Error(
        "Password unchanged. Please enter a new password if you wish to update the password."
      );
    }
    const { username } = session.user;
    const dbusername = `${username}_${dbuser}`;

    if (/[!@#$%^&*(),.?":{}|<>$]/.test(password)) {
      throw new Error("Password must not contain special characters.");
    }

    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();
    const db = client.db("admin");

    if (password.trim() !== "" && !/[!@#$%^&*(),.?":{}|<>$]/.test(password)) {
      await db.command({
        updateUser: dbusername,
        pwd: password,
      });
    }

    revalidatePath("/");

    return {
      success: true,
      message: `Database user password updated successfully.`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function deleteDb(dbname) {
  const session = await auth();
  let client = null;

  try {
    if (!session) {
      throw new Error("Not authenticated");
    }

    if (!dbname) {
      throw new Error("Database name is required.");
    }

    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);

    await client.connect();
    const adminDb = client.db("admin");

    const usersInfo = await adminDb.command({ usersInfo: { forAllDBs: true } });

    const usersToDelete = usersInfo.users
      .filter((user) => user.roles.some((role) => role.db === dbname))
      .map((user) => user.user);

    for (const user of usersToDelete) {
      await adminDb.command({ dropUser: user });
    }

    const dbToDelete = client.db(dbname);
    await dbToDelete.dropDatabase();

    revalidatePath("/");

    return {
      success: true,
      message: `Database "${dbname}" and all associated users deleted successfully.`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function createCollection(dbname, collection) {
  const session = await auth();
  let client = null;

  try {
    if (!session) {
      throw new Error("Not authenticated");
    }

    if (!dbname || !collection) {
      throw new Error("Missing required parameters: dbname and collection.");
    }

    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();
    const db = client.db(dbname);

    const collections = await db.listCollections().toArray();
    const existingCollection = collections.find(
      (col) => col.name === collection
    );

    if (existingCollection) {
      throw new Error(`Collection: "${collection}" already exists`);
    }

    await db.createCollection(collection);

    revalidatePath("/");

    return {
      success: true,
      message: `Collection "${collection}" created successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function getCollections(collection) {
  const session = await auth();
  let client = null;
  try {
    if (!session) {
      throw new Error("Not authenticated");
    }
    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();

    const db = client.db(collection);

    const collections = await db.listCollections().toArray();

    const data = await JSON.parse(JSON.stringify(collections));

    return data;
  } catch (error) {
    return null;
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function updateCollection(dbname, oldColName, newColName) {
  const session = await auth();
  let client = null;

  try {
    if (!session) {
      throw new Error("Not authenticated");
    }

    if (!dbname || !oldColName || !newColName) {
      throw new Error("Missing required parameters: dbname or collection.");
    }

    if (oldColName === newColName) {
      throw new Error("Old name and new name are the same. No change was made");
    }

    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();
    const db = client.db(dbname);

    const collections = await db.listCollections().toArray();
    const existingCollection = collections.find(
      (col) => col.name === oldColName
    );

    if (!existingCollection) {
      throw new Error(`Collection "${oldColName}" does not exist`);
    }

    const newCollectionExists = collections.find(
      (col) => col.name === newColName
    );
    if (newCollectionExists) {
      throw new Error(`Collection "${newColName}" already exists`);
    }

    await db.collection(oldColName).rename(newColName);

    revalidatePath("/");

    return {
      success: true,
      message: `Collection "${oldColName}" renamed to "${newColName}" successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function deleteCollection(dbname, collection) {
  const session = await auth();
  let client = null;

  try {
    if (!session) {
      throw new Error("Not authenticated");
    }

    if (!collection) {
      throw new Error("Missing required parameters: collection.");
    }

    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();
    const db = client.db(dbname);

    await db.dropCollection(collection);

    revalidatePath("/");

    return {
      success: true,
      message: "Collection deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function getDocuments(collection, document) {
  const session = await auth();
  let client = null;
  try {
    if (!session) {
      throw new Error("Not authenticated");
    }
    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();

    const db = client.db(collection);

    const documents = await db.collection(document).find().toArray();

    const data = await JSON.parse(JSON.stringify(documents));

    return data;
  } catch (error) {
    return null;
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function updateDocument(dbname, collection, id, data) {
  const session = await auth();
  let client = null;

  try {
    if (!session) {
      throw new Error("Not authenticated");
    }

    const update = JSON.parse(data);

    if (!update || typeof update !== "object" || Array.isArray(update)) {
      throw new Error("Invalid update data. Must be a valid JSON object.");
    }

    if ("_id" in update) {
      delete update._id;
    }

    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();
    const db = client.db(dbname);

    const result = await db
      .collection(collection)
      .updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (result.matchedCount === 0) {
      throw new Error("Document not found.");
    }

    revalidatePath("/");

    return {
      success: true,
      message: "Document updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function createDocument(dbname, collection, data) {
  const session = await auth();
  let client = null;

  try {
    if (!session) {
      throw new Error("Not authenticated");
    }

    let update = JSON.parse(data);

    if (!update || typeof update !== "object" || Array.isArray(update)) {
      throw new Error("Invalid update data. Must be a valid JSON object.");
    }

    const _id = new ObjectId();
    const createAt = new Date();
    const updatedAt = new Date();

    update = { _id, ...update, createAt, updatedAt };

    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();
    const db = client.db(dbname);

    await db.collection(collection).insertOne(update);

    revalidatePath("/");

    return {
      success: true,
      message: "Document added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}

export async function deleteDocument(dbname, collection, id) {
  const session = await auth();
  let client = null;

  try {
    if (!session) {
      throw new Error("Not authenticated");
    }

    const serviceUri = `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@127.0.0.1:27017/admin?authSource=admin`;
    const client = new MongoClient(serviceUri);
    await client.connect();
    const db = client.db(dbname);

    await db.collection(collection).deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/");

    return {
      success: true,
      message: "Document deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  } finally {
    if (client && client.topology && client.topology.isConnected()) {
      await client.close();
    }
  }
}
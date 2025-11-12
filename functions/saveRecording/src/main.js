import { Client, Databases } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  try {
    const { userId, fileId, url } = JSON.parse(req.body || "{}");

    if (!userId || !fileId || !url) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // 初始化 Appwrite 客户端
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID);

    const databases = new Databases(client);

    // 创建录音记录
    const result = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.COLLECTION_ID,
      "unique()",
      { userId, fileId, url }
    );

    return res.json({
      message: "录音信息已保存",
      document: result,
    });
  } catch (err) {
    error(err);
    return res.status(500).json({ error: err.message });
  }
};
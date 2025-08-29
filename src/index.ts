import app from "./app";
import { connectDB } from "./db";
import { config } from "./config";

(async () => {
  await connectDB();
  app.listen(config.port, () =>
    console.log(`Server running on http://localhost:${config.port}`)
  );
})();

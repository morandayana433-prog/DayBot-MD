import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import dotenv from "dotenv";
dotenv.config();

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    browser: ["DayBot MD", "Chrome", "1.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { qr, connection } = update;

    if (qr) {
      console.log("Escanea el código QR:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("🔥 DayBot MD está conectado!");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || "";

    if (text.toLowerCase() === "hola") {
      await sock.sendMessage(from, { text: "Hola! Soy DayBot MD 🤖✨" });
    }
  });
};

startBot();

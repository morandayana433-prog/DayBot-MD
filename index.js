import makeWASocket, {
    useSingleFileAuthState,
    fetchLatestBaileysVersion
} from '@whiskeysockets/baileys'

import qrcode from 'qrcode-terminal'
import pino from 'pino'
import fs from 'fs'
import chalk from 'chalk'

console.log(chalk.cyan(`
━━━━━━━ 🩷 DAYBOT-MD 🩷 ━━━━━━━
   ¡Iniciando tu bot Cute 😺!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`))

async function startDayBot() {

    const { state, saveCreds } = useSingleFileAuthState('./session.json')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        version
    })

    // SISTEMA DE QR DOBLE
    sock.ev.on('connection.update', ({ qr }) => {
        if (qr) {
            console.log("Selecciona tipo de QR:\n")
            console.log("1 = Imagen QR")
            console.log("2 = Texto QR\n")

            process.stdin.once("data", (choice) => {
                choice = choice.toString().trim()

                if (choice === "1") {
                    console.log(chalk.green("🔵 Escanea este QR:"))
                    console.log(qr)
                } else {
                    console.log(chalk.magenta("🟣 QR en texto:"))
                    qrcode.generate(qr, { small: true })
                }
            })
        }
    })

    // EVENTO DE MENSAJES
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const from = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        // Respuesta simple
        if (text?.toLowerCase() === 'hola') {
            await sock.sendMessage(from, { text: "Holaaa 🩷✨ ¿Cómo estás?" })
        }

        // MENÚ PRINCIPAL
        if (text === '.menu') {
            await sock.sendMessage(from, {
                text: `
🌸 *DAYBOT-MD MENU* 🌸
──────────────────────────
🩷 .sticker – Crear sticker
🩷 .play – Descargar música
🩷 .foto – Imagen random anime
🩷 .menu2 – Más comandos
──────────────────────────
DayBot-MD by Dayana ✨
                `
            })
        }
    })

    sock.ev.on('creds.update', saveCreds)
}

startDayBot()

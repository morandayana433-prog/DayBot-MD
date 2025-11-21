import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
fetchLatestBaileysVersion, makeInMemoryStore } from '@whiskeysockets/baileys'
import pino from 'pino'
import qrcode from 'qrcode-terminal'

async function connectBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const { version } = await fetchLatestBaileysVersion()

    console.log(`
================================================
 💗 DAYBOT-MD CONEXIÓN WHATSAPP 
================================================
Selecciona el tipo de QR:
1 = QR normal (imagen)
2 = QR en texto
================================================
`)

    process.stdout.write("Ingresa opción (1 o 2): ")

    process.stdin.on('data', async (data) => {
        const opcion = data.toString().trim()

        if (opcion !== "1" && opcion !== "2") {
            console.log("❌ Opción inválida, escribe 1 o 2.")
            return
        }

        const sock = makeWASocket({
            printQRInTerminal: opcion === "1" ? true : false,
            browser: ['DayBot-MD', 'Chrome', '1.0'],
            auth: state,
            logger: pino({ level: 'silent' })
        })

        // Generar QR de texto (ASCII)
        if (opcion === "2") {
            sock.ev.on('connection.update', async (update) => {
                const { qr } = update
                if (qr) {
                    console.log("➡️ Escanea este QR en texto:")
                    qrcode.generate(qr, { small: true })
                }
            })
        }

        sock.ev.on('creds.update', saveCreds)
        console.log("✨ Esperando conexión a WhatsApp...")

        process.stdin.pause()
    })
}

connectBot()

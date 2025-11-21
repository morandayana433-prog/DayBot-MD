import makeWASocket, { 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion 
} from '@whiskeysockets/baileys'
import pino from 'pino'

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const { version } = await fetchLatestBaileysVersion()

    // Pedir número de teléfono
    console.log("Ingresa tu número de WhatsApp en formato internacional (Ej: +593987654321):")
    process.stdin.once("data", async (number) => {

        number = number.toString().trim()

        const sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            auth: state,
            version,
            printQRInTerminal: false
        })

        // Generar código de vinculación
        try {
            const code = await sock.requestPairingCode(number)

            console.log("\n🔐 Tu código para vincular WhatsApp es:\n")
            console.log("      " + code + "\n")
            console.log("👉 Abre WhatsApp → Dispositivos vinculados → Vincular con código\n")

        } catch (e) {
            console.log("❌ Error generando código:", e)
        }

        sock.ev.on('creds.update', saveCreds)
    })
}

start()

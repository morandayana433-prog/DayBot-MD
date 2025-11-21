import makeWASocket, { 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion 
} from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import pino from 'pino'

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        version
    })

    // Sistema QR doble: imagen o texto
    sock.ev.on('connection.update', ({ qr }) => {
        if (qr) {
            console.log("\nSelecciona tipo de QR:")
            console.log("1 = QR normal (imagen)")
            console.log("2 = QR en texto\n")

            process.stdin.once("data", (choice) => {
                choice = choice.toString().trim()

                if (choice === "1") {
                    console.log("🔵 Escanea el QR:")
                    console.log(qr)
                } else {
                    console.log("🟣 QR en texto:")
                    qrcode.generate(qr, { small: true })
                }
            })
        }
    })

    sock.ev.on('creds.update', saveCreds)
}

start()
                        

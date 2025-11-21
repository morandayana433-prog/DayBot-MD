export const commands = {
  ping: {
    description: "Prueba del bot",
    execute: async (sock, chatId) => {
      await sock.sendMessage(chatId, { text: "Pong! 🏓" });
    },
  },

  ayuda: {
    description: "Lista de comandos",
    execute: async (sock, chatId) => {
      await sock.sendMessage(chatId, {
        text: "📌 *Lista de comandos*\n- ping\n- ayuda\n- hola"
      });
    },
  },
};

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {

  // Slash Command
  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === "vasvex") {

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: "❌ ต้องเป็นแอดมินเท่านั้น", ephemeral: true });
      }

      const channel = interaction.options.getChannel("channel");
      const role = interaction.options.getRole("role");
      const number = interaction.options.getString("number");

      const button = new ButtonBuilder()
        .setCustomId(`verify_${role.id}_${number}`)
        .setLabel("ยืนยันตัวตน")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      await channel.send({
        content: "📌 กรุณากดยืนยันตัวตน",
        components: [row]
      });

      await interaction.reply({ content: "✅ สร้างระบบยืนยันแล้ว", ephemeral: true });
    }
  }

  // กดปุ่ม
  if (interaction.isButton()) {

    if (interaction.customId.startsWith("verify_")) {

      const data = interaction.customId.split("_");
      const roleId = data[1];
      const correctNumber = data[2];

      const modal = new ModalBuilder()
        .setCustomId(`modal_${roleId}_${correctNumber}`)
        .setTitle("กรอกเลขยืนยัน");

      const input = new TextInputBuilder()
        .setCustomId("verify_input")
        .setLabel("กรอกเลขตามที่กำหนด")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);

      await interaction.showModal(modal);
    }
  }

  // ส่ง modal
  if (interaction.isModalSubmit()) {

    if (interaction.customId.startsWith("modal_")) {

      const data = interaction.customId.split("_");
      const roleId = data[1];
      const correctNumber = data[2];

      const input = interaction.fields.getTextInputValue("verify_input");

      if (input === correctNumber) {
        await interaction.member.roles.add(roleId);
        await interaction.reply({ content: "✅ ยืนยันสำเร็จ ได้รับยศแล้ว", ephemeral: true });
      } else {
        await interaction.reply({ content: "❌ เลขไม่ถูกต้อง", ephemeral: true });
      }
    }
  }

});

client.login("token");
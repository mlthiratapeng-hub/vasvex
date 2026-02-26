const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("vasvex")
    .setDescription("สร้างระบบยืนยันตัวตน")
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("เลือกห้อง")
        .setRequired(true))
    .addRoleOption(option =>
      option.setName("role")
        .setDescription("ยศที่จะให้")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("number")
        .setDescription("เลขให้กรอก")
        .setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken("token");

rest.put(
  Routes.applicationCommands("CLIENT_ID"),
  { body: commands }
);
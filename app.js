const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const PORT = 3000;
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require('dotenv').config()

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "anexos");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const fs = require("fs");
const dir = "anexos";

if (!fs.existsSync(dir)) {
  fs.mkdir(dir, (err) => {
    if (err) {
      console.log("Deu ruim...");
      return;
    }
    console.log("Diretório criado! =)");
  });
}

app.post("/enviar-email", upload.array("anexos", 10), (req, res) => {
  const { nome, email, telefone, assunto, mensagem } = req.body;
  const anexos = req.files.map((file) => ({
    filename: file.originalname,
    path: file.path,
  }));

  const transporter = nodemailer.createTransport({
    service: "Outlook",
    auth: {
      user: `${process.env.NODEMAILER_USERNAME}`,
      pass: `${process.env.NODEMAILER_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: "g.oliiveira@hotmail.com",
    to: "g.oliiveira@hotmail.com",
    // to: "contato_nonno@libero.it",
    subject: "Novo contato da página",
    text: `Nome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\nAssunto: ${assunto}\nMensagem: ${mensagem}`,
    attachments: anexos.map((anexo) => ({
      filename: anexo.filename,
      path: anexo.path,
    })),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send({ message: "Erro ao enviar e-mail", error });
    } else {
      console.log("E-mail enviado: " + info.response);
      res.status(200).send({ message: "E-mail enviado com sucesso" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;
const cors = require('cors');
const multer = require('multer');
const path = require('path');

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'anexos'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


app.post('/enviar-email', upload.array('anexos', 10), (req, res) => {
  const { nome, email, telefone, assunto, mensagem } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: 'g.oliiveira@hotmail.com',
      pass: '60fcky0ur53lf'
    }
  });

  const mailOptions = {
    from: 'g.oliiveira@hotmail.com',
    to: 'contato_nonno@libero.it',
    // to: 'g.oliiveira@hotmail.com',
    subject: 'Novo contato da página',
    text: `Nome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\nAssunto: ${assunto}\nMensagem: ${mensagem}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send({ message: 'Erro ao enviar e-mail', error });
    } else {
      console.log('E-mail enviado: ' + info.response);
      res.status(200).send({ message: 'E-mail enviado com sucesso' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

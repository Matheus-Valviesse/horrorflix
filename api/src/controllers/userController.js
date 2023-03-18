const User = require("../models/User.js");
const Token = require("../models/Token.js");
const emailConfirmationTemplate = require("../functions/templateUserConfirmationEmail.js");
const emailRecoverPasswordTemplate = require("../functions/templateUserRecoverPassword.js");
const randomPasswordGenerate = require("../functions/ramdomPasswordGenerate.js");
const { Op, Model } = require("sequelize");
const validate = require("../functions/validate.js");
const nodemailer = require("nodemailer");
const { hash, compare } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");
const dotenv = require("dotenv");
const Type = require("../models/Type.js");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.E_HOST,
  port: process.env.E_PORT,
  secure: false,
  auth: {
    user: process.env.E_USER,
    pass: process.env.E_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const userController = {
  create: async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
      validate({ name, isRequired: true });
      validate({ email, type: "email", isRequired: true });
      validate({ password, type: "senha", isRequired: true });

      const userExist = await User.findOne({
        where: {
          email: email,
        },
      });

      if (userExist) throw new Error("Email já cadastrado.");

      const passwordEncrypted = await hash(password, 10);

      const user = await User.create({
        name: name,
        email: email,
        validateEmail: false,
        password: passwordEncrypted,
        role: role,
      });

      const id = user.userId;

      const emailToken = sign({ userId: id }, process.env.PRIVATE_KEY, {
        expiresIn: "1d",
      });

      const emailTokenUser = await Token.create({
        userId: id,
        token: emailToken,
      });

      await transporter.sendMail({
        text: "Autenticação",
        subject: "Confirme seu email",
        from: `HorroFlix <nodecinemapc2@gmail.com>`,
        to: `${user.email}`,
        html: emailConfirmationTemplate(
          "user",
          user.name,
          emailTokenUser.token
        ),
      });

      return res
        .status(200)
        .json({ mensagem: `Adm ${user.name} cadastrado com sucesso.` });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  emailValidate: async (req, res) => {
    const token = req.params.token;

    try {
      let userId = "";

      try {
        const resultado = verify(token, process.env.PRIVATE_KEY);

        if (!resultado) throw new Error("Token invalido");

        userId = resultado.userId;
      } catch (error) {
        return res.status(400).json({ erro: "Token Inválido." });
      }

      const user = await User.findByPk(userId);
      if (!user)
        return res.status(404).json({ erro: "Usuário não encontrado." });

      const tokenValid = await Token.findOne({
        where: { userId: userId },
      });

      if (!user.validateEmail) {
        if (tokenValid) await tokenValid.destroy();
        await user.update({ validateEmail: true });
        return res
          .status(200)
          .json({ mensagem: "Email verificado com sucesso." });
      } else {
        return res.status(400).json({ erro: "Email já verificado." });
      }
    } catch (error) {
      return res.status(401).json({ erro: error.message });
    }
  },

  auth: async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password)
        throw new Error("Email e senha são obrigatórios.");

      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user)
        return res.status(404).json({ erro: "Usuário não encontrado." });

      if (user.validateEmail != true)
        return res.status(404).json({ erro: "Usuário não verificado." });

      const resultado = await compare(password, user.password);

      if (!resultado) throw new Error("Usuário ou senha inválida.");

      const token = sign(
        { userId: user.userId, role: user.role },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "1d",
        }
      );

      return res
        .status(200)
        .json({ mensagem: "Login realizado com sucesso", token });
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  },

  getInfo: async (req, res) => {
    const { userId: id, role: role } = req.body;

    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password", "validateEmail"] },
      });

      if (!user)
        return res.status(404).json({ erro: "Usuário não encontrado." });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    const { userId: id, email, name } = req.body;

    if (!email && !name)
      return res.status(400).json({
        erro: "Não foram enviadas informações para serem atualizadas.",
      });

    try {
      const user = await User.findByPk(id);

      if (!user)
        return res.status(404).json({ erro: "Usuário não encontrado." });

      if (user) {
        validate({ name, isRequired: true });

        if (user.name === name)
          return res.status(400).json({
            erro: "A informação a ser atualizada deve ser diferente da atual.",
          });
      }

      if (email) {
        if (user.email === email)
          return res.status(400).json({
            erro: "A informação a ser atualizada deve ser diferente da atual.",
          });

        validate({ email, type: "email" });

        const info = await User.findOne({
          where: {
            email: email,
          },

          if(info) {
            if (info.email === email)
              throw Error("Email já está sendo utilizado.");
          },
        });
      }

      await user.update({
        name: name ? name : user.name,
        email: email ? email : user.email,
      });

      return res
        .status(201)
        .json({ mensagem: `Informações atualizadas com sucesso.` });
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  },

  delete: async (req, res) => {
    const { userId: id } = req.body;
    console.log(id);
    try {
      const user = await User.findByPk(id);

      if (!user)
        return res.status(404).json({ erro: "Usuário não encontrado." });

      const userDeletado = await user.destroy();

      return res.status(200).json({
        mensagem: `O adm ${userDeletado.name} excluido com sucesso.`,
      });
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  resendVerificationEmail: async (req, res) => {
    const { email } = req.body;

    try {
      if (!email)
        return res.status(400).json({ erro: "Campo email é obrigatório." });

      const adm = await Adm.findOne({
        where: {
          email: `${email}`,
        },
      });

      if (!adm) return res.status(404).json({ erro: "Email não encontrado." });

      if (adm.validateEmail)
        return res.status(400).json({ erro: "Email já verificado." });

      const tokenEmail = await Token.findOne({
        where: {
          userId: `${adm.diretorId}@ADM`,
        },
      });

      if (tokenEmail) await tokenEmail.destroy();

      const token = sign(
        { userId: `${diretor.diretorId}@ADM` },
        process.env.PRIVATE_KEY,
        { expiresIn: "1d" }
      );

      const emailNovoToken = await Token.create({
        userId: `${diretor.diretorId}@ADM`,
        token: token,
      });

      await transporter.sendMail({
        text: "Autenticação",
        subject: "Confirme seu email",
        from: `Cinema <nodecinemapc2@gmail.com>`,
        to: `${diretor.email}`,
        html: emailConfirmationTemplate(
          "diretor",
          diretor.name,
          emailNovoToken.token
        ),
      });

      return res
        .status(200)
        .json({ mensagem: "Email de verificação enviado." });
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  },
};

module.exports = userController;

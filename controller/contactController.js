const { Contact } = require("../service/schemas/schemas");

const get = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { ...params } = req.query;

    const result = await Contact.find(
      { owner, ...params },
      "-createdAt -updatedAt"
    );

    res.json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } catch (e) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found contact id`,
      data: "Not Found",
    });
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  try {
    const result = await Contact.findById({ _id: contactId, owner });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found contact id: ${contactId}`,
      data: "Not Found",
    });
    next(e);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { _id: owner } = req.user;
  try {
    const result = await Contact.create({ name, email, phone, owner });
    if (!result) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found data`,
        data: "Not Found",
      });
    }
    res.status(201).json({
      status: "success",
      code: 201,
      data: { contact: result },
    });
  } catch (e) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found`,
      data: "Not Found",
    });
    next(e);
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const { name, email, phone } = req.body;

  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId, owner },
      { name, email, phone }
    );
    if (!result) {
      res.status(400).json({
        status: "error",
        code: 400,
        message: `missing field favorite`,
        data: "Not Found",
      });
    }
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: `missing field favorite`,
      data: "Not Found",
    });
    next(e);
  }
};

const upStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const { favorite } = req.body;
  try {
    if (!contactId) {
      res.status(400).json({
        status: "error",
        code: 400,
        message: `missing field favorite`,
        data: "Not Found",
      });
    }
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId, owner },
      { favorite }
    );
    if (!result) {
      res.status(400).json({
        status: "error",
        code: 400,
        message: `missing field favorite`,
        data: "Not Found",
      });
    }
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: `missing field favorite`,
      data: "Not Found",
    });
    next(e);
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  try {
    if (!contactId) {
      res.status(400).json({
        status: "error",
        code: 400,
        message: `missing field favorite`,
        data: "Not Found",
      });
    }
    const result = await Contact.findByIdAndRemove({ _id: contactId, owner });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: `missing field favorite`,
      data: "Not Found",
    });
    next(e);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
  upStatus,
};

import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Contact, { Label, IContact, ILabel } from "../../models/Contact";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";

const router: Router = Router();

// @route   POST api/contact
// @desc    Create user's contact
// @access  Private
router.post(
  "/",
  [auth, check("firstName", "First Name is required").not().isEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const {
      firstName,
      middleName,
      lastName,
      address,
      avatar,
      email,
      phones,
      labels,
      company,
      jobTitle,
      birthday,
    } = req.body;

    // Build contact object based on IContact
    const contactFields = {
      user: req.userId,
      firstName,
      middleName,
      lastName,
      address,
      email,
      avatar,
      phones,
      labels,
      company,
      jobTitle,
      birthday,
    };

    try {
      // Create
      const contact = new Contact(contactFields);

      await contact.save();

      // Create labels
      // if (labels) {
      //   labels.forEach(async (label: ILabel) => {
      //     const newLabel = new Label({
      //       name: label.name,
      //       contact: contact._id,
      //     });

      //     await newLabel.save();
      //   });
      // }

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

// @route   POST api/label
// @desc    Create user's label
// @access  Private
router.post("/label", auth, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // Check if user already has a label with the same name
    const label = await Label.findOne({
      user: req.userId,
      name,
    });

    if (label) {
      return res.json(label);
    }
    // Create new label
    const newLabel = new Label({
      user: req.userId,
      name,
    });

    const labelSaved = await newLabel.save();

    res.json(labelSaved);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   GET api/contact/labels
// @desc    Get all user labels
// @access  Private
router.get("/label", auth, async (req: Request, res: Response) => {
  try {
    // fetch all labels of current user
    const labels = await Contact.find({ user: req.userId }).distinct("labels");
    res.json(labels);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   GET api/contact
// @desc    Get all user contacts
// @access  Private
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    // fetch all contacts of current user
    const contacts = await Contact.find({ user: req.userId }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   GET api/contacts/:contactId
// @desc    Get contact by contactId
// @access  Private
router.get("/:contactId", auth, async (req: Request, res: Response) => {
  try {
    const contact: IContact = await Contact.findOne({
      _id: req.params.contactId,
      user: req.userId,
    });

    if (!contact)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Contact not found" });

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Contact not found" });
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   PUT api/contacts/:contactId
// @desc    Update contact by contactId
// @access  Private
router.put("/:contactId", auth, async (req: Request, res: Response) => {
  try {
    // update contact and labels
    const contact: IContact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, user: req.userId },
      { $set: req.body },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Contact not found" });
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   DELETE api/contacts/:contactId
// @desc    Delete contact
// @access  Private
router.delete("/:contactId", auth, async (req: Request, res: Response) => {
  try {
    // Remove contact
    await Contact.findOneAndRemove({
      _id: req.params.contactId,
      user: req.userId,
    });

    res.json({ msg: "Contact removed" });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;

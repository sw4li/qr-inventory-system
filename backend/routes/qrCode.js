import express from "express";
import QRCode from "qrcode";
import { ItemModel } from "../models/itemModel.js";

const router = express.Router();

// GET /api/qr/:itemId - Generate QR code image
router.get("/:itemId", async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const qrCodeDataUrl = await QRCode.toDataURL(item.qr_code, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 300,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    res.json({
      success: true,
      data: {
        itemId: item.id,
        itemName: item.name,
        qrCode: item.qr_code,
        qrImage: qrCodeDataUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/qr/code/:qrCode - Generate QR by QR code string
router.get("/code/:qrCode", async (req, res, next) => {
  try {
    const qrCode = req.params.qrCode;
    const item = await ItemModel.findByQRCode(qrCode);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item with this QR code not found",
      });
    }
    const qrCodeDataUrl = await QRCode.toDataURL(qrCode, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 300,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    res.json({
      success: true,
      data: {
        itemId: item.id,
        itemName: item.name,
        qrCode: item.qr_code,
        qrImage: qrCodeDataUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/qr/batch/:itemIds - Generate multiple QR codes
router.get("/batch/:itemIds", async (req, res, next) => {
  try {
    const itemIds = req.params.itemIds.split(",").map((id) => parseInt(id));

    const qrCodes = [];

    for (const itemId of itemIds) {
      const item = await ItemModel.findById(itemId);
      if (item) {
        const qrCodeDataUrl = await QRCode.toDataURL(item.qr_code, {
          errorCorrectionLevel: "H",
          type: "image/png",
          width: 300,
        });
        qrCodes.push({
          itemId: item.id,
          itemName: item.name,
          qrCode: item.qr_code,
          qrImage: qrCodeDataUrl,
        });
      }
    }

    res.json({
      success: true,
      count: qrCodes.length,
      data: qrCodes,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
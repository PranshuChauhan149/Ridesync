"use client";

import { IVehicle } from "../models/vehicle.modal";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


type PropsType = {
  open: boolean;
  onClose: () => void;
  data: IVehicle | null;
};

const PricingModal = ({ open, onClose, data }: PropsType) => {
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [baseFare, setBaseFare] = useState("");
  const [pricePerKM, setPricePerKM] = useState("");
  const [waitingCharge, setWaitingCharge] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setImagePreview(data?.imageUrl || "");
    setImageFile(null);
    setBaseFare(data?.baseFare ? String(data.baseFare) : "");
    setPricePerKM(data?.pricePerKM ? String(data.pricePerKM) : "");
    setWaitingCharge(data?.waitingCharge ? String(data.waitingCharge) : "");
  }, [open, data]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;

    const fetchPricing = async () => {
      setIsFetching(true);
      try {
        const { data: pricingData } = await axios.get("/api/partner/onboarding/pricing");
        if (!active) {
          return;
        }

        setImagePreview(pricingData?.imageUrl || "");
        setBaseFare(
          pricingData?.baseFare !== undefined ? String(pricingData.baseFare) : "",
        );
        setPricePerKM(
          pricingData?.pricePerKM !== undefined ? String(pricingData.pricePerKM) : "",
        );
        setWaitingCharge(
          pricingData?.waitingCharge !== undefined ? String(pricingData.waitingCharge) : "",
        );
      } catch (error) {
        if (!active) {
          return;
        }

        // Ignore not-found case because first-time users may not have pricing yet.
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return;
        }

        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Unable to load saved pricing";
        toast.error(message);
      } finally {
        if (active) {
          setIsFetching(false);
        }
      }
    };

    fetchPricing();

    return () => {
      active = false;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(previewUrl);
  };

  const handleSave = async () => {
    if (baseFare === "" || pricePerKM === "" || waitingCharge === "") {
      toast.error("Please fill all pricing fields");
      return;
    }

    const formData = new FormData();
    formData.append("baseFare", baseFare);
    formData.append("pricePerKM", pricePerKM);
    formData.append("waitingCharge", waitingCharge);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setIsSaving(true);
    try {
      await axios.post("/api/partner/onboarding/pricing", formData);
      toast.success("Pricing saved successfully");
      onClose();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Unable to save pricing";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className=" text-black fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-300 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-zinc-300 px-6 py-4">
          <h2 className="text-2xl font-semibold text-zinc-900">Pricing and Vehicle Image</h2>
        </div>

        <div className="space-y-5 px-6 py-5">
          <label className="block cursor-pointer rounded-2xl border border-dashed border-zinc-500 p-3 hover:border-zinc-700">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Vehicle preview"
                className="h-52 w-full rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-52 w-full items-center justify-center rounded-xl bg-zinc-50 text-sm text-zinc-500">
                Click to upload vehicle image
              </div>
            )}
          </label>

          <div>
            <p className="mb-2 text-sm font-medium text-zinc-800">Base Fare</p>
            <div className="flex h-12 items-center rounded-xl border border-zinc-300 px-3">
              <span className="mr-2 text-zinc-600">₹</span>
              <input
                type="number"
                value={baseFare}
                onChange={(event) => setBaseFare(event.target.value)}
                placeholder="base fare"
                className="w-full border-none bg-transparent text-sm text-zinc-900 outline-none"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-zinc-800">Price Per KM</p>
            <div className="flex h-12 items-center rounded-xl border border-zinc-300 px-3">
              <span className="mr-2 text-zinc-600">₹</span>
              <input
                type="number"
                value={pricePerKM}
                onChange={(event) => setPricePerKM(event.target.value)}
                placeholder="price per KM"
                className="w-full border-none bg-transparent text-sm text-zinc-900 outline-none"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-zinc-800">Waiting Charge</p>
            <div className="flex h-12 items-center rounded-xl border border-zinc-300 px-3">
              <span className="mr-2 text-zinc-600">₹</span>
              <input
                type="number"
                value={waitingCharge}
                onChange={(event) => setWaitingCharge(event.target.value)}
                placeholder="Waiting Charge"
                className="w-full border-none bg-transparent text-sm text-zinc-900 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-zinc-300 px-6 py-4">
          <button
            type="button"
            disabled={isSaving || isFetching}
            onClick={onClose}
            className="h-11 rounded-xl border border-zinc-400 bg-white text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving || isFetching}
            onClick={handleSave}
            className="h-11 rounded-xl bg-black text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : isFetching ? "Loading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;

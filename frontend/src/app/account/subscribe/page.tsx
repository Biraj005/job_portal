"use client";

import useRazorpay from "@/components/scriptloader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function Subscribepage() {
  const razorpayLoaded = useRazorpay();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    const {
      data: { ord },
    } = await axios.post(
      `${process.env.NEXT_PUBLIC_USER_URL}/api/payment/checkout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  };
  var options = {
    key: "YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
    amount: "50000", // Amount is in currency subunits.
    currency: "INR",
    name: "Acme Corp", //your business name
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: "order_9A33XWu170gUtm", // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
    prefill: {
      //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
      name: "Gaurav Kumar", //your customer's name
      email: "gaurav.kumar@example.com",
      contact: "+919876543210", //Provide the customer's phone number for better conversion rates
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  return <div>Subscribepage</div>;
}

export default Subscribepage;

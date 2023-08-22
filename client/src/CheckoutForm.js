import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function CheckoutForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstNameFilled, setFirstNameFilled] = useState(false);
  const [lastNameFilled, setLastNameFilled] = useState(false);
  const [phoneNumberFilled, setPhoneNumberFilled] = useState(false);
  const [emailFilled, setEmailFilled] = useState(false);
  const [passwordFilled, setPasswordFilled] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <div className="input-with-checkmark">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setFirstNameFilled(e.target.value !== "");
            }}
          />
          {/* Render checkmark if firstNameFilled is true */}
          {firstNameFilled && (
            <div className="checkmark">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="checkmark-icon"
              />
            </div>
          )}
        </div>
        <div className="input-with-checkmark">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setLastNameFilled(e.target.value !== "");
            }}
          />
          {/* Render checkmark if firstNameFilled is true */}
          {lastNameFilled && (
            <div className="checkmark">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="checkmark-icon"
              />
            </div>
          )}
        </div>
        <div className="input-with-checkmark">
          <input
            type="text"
            placeholder="Number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setPhoneNumberFilled(e.target.value !== "");
            }}
          />
          {phoneNumberFilled && (
            <div className="checkmark">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="checkmark-icon"
              />
            </div>
          )}
        </div>
        <div className="input-with-checkmark">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailFilled(e.target.value !== "");
            }}
          />
          {emailFilled && (
            <div className="checkmark">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="checkmark-icon"
              />
            </div>
          )}
        </div>
        <div className="input-with-checkmark">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordFilled(e.target.value !== "");
            }}
          />
          {passwordFilled && (
            <div className="checkmark">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="checkmark-icon"
              />
            </div>
          )}
        </div>

        <PaymentElement id="payment-element" />
        <button disabled={isProcessing || !stripe || !elements} id="submit">
          <span id="button-text">
            {isProcessing ? "Processing ... " : "CREATE ACCOUNT"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </div>
    </form>
  );
}

import { useState } from "react";
import { motion } from "motion/react";
import "./Contact.css";

/**
 * "Send a Raven" — a real contact form.
 *
 * Delivery uses Web3Forms (https://web3forms.com): get a FREE access key (it's
 * emailed to you instantly, no dashboard), then either
 *   1. create a `.env` file at the project root with
 *        REACT_APP_WEB3FORMS_KEY=your-key-here
 *      and RESTART `npm start`, or
 *   2. paste it into the fallback string below.
 * NOTE: the REACT_APP_ prefix is REQUIRED — Create React App ignores any env
 * var without it, so the key would silently be undefined.
 * Until a key is set, the form gracefully falls back to opening the visitor's
 * mail client (mailto) so it still works.
 */
const WEB3FORMS_KEY =
  process.env.REACT_APP_WEB3FORMS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY";
const KEY_CONFIGURED =
  WEB3FORMS_KEY && WEB3FORMS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY";

const CONTACT = {
  email: "dominicguevarra08@gmail.com",
  github: "https://github.com/Kam-ino",
  linkedin: "https://www.linkedin.com/in/dominic-guevarra-110b11285/",
  resume:
    "https://drive.google.com/file/d/16SPsT7gw2MgRJkKQ3aOUJpnngh_EEcCw/view?usp=sharing",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LINKS = [
  { icon: "✉️", label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: "🗡️", label: "GitHub", value: "github.com/Kam-ino", href: CONTACT.github },
  { icon: "📓", label: "LinkedIn", value: "Dominic Guevarra", href: CONTACT.linkedin },
  { icon: "📜", label: "Résumé", value: "The Full Decree", href: CONTACT.resume },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    botcheck: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | mailto | error

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Pray, tell me your name.";
    if (!form.email.trim()) e.email = "I need a return address.";
    else if (!EMAIL_RE.test(form.email)) e.email = "That address looks malformed.";
    if (!form.message.trim()) e.message = "Your message scroll is empty.";
    else if (form.message.trim().length < 10)
      e.message = "A few more words, if you please.";
    return e;
  };

  const mailtoFallback = () => {
    const subject = encodeURIComponent(form.subject || `A raven from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    setStatus("mailto");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    if (form.botcheck) return; // honeypot tripped — silently ignore bots

    if (!KEY_CONFIGURED) {
      mailtoFallback();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          subject: form.subject || `New raven from ${form.name} (portfolio)`,
          message: form.message,
          from_name: form.name,
          botcheck: form.botcheck,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "", botcheck: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const fieldProps = (name) => ({
    name,
    value: form[name],
    onChange: update,
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: `raven-field ${errors[name] ? "is-invalid" : ""}`,
  });

  return (
    <div className="contact">
      <div className="contact-grid">
        {/* ---- The form ---- */}
        <motion.form
          className="raven-form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="raven-row">
            <div className="raven-group">
              <label htmlFor="name">Thy Name</label>
              <input id="name" type="text" autoComplete="name" {...fieldProps("name")} />
              {errors.name && (
                <span className="raven-error" id="name-error">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="raven-group">
              <label htmlFor="email">Return Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@realm.com"
                {...fieldProps("email")}
              />
              {errors.email && (
                <span className="raven-error" id="email-error">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="raven-group">
            <label htmlFor="subject">
              Subject <span className="raven-optional">(optional)</span>
            </label>
            <input
              id="subject"
              type="text"
              placeholder="A quest, a role, or a friendly word"
              {...fieldProps("subject")}
            />
          </div>

          <div className="raven-group">
            <label htmlFor="message">Thy Message</label>
            <textarea id="message" rows={6} {...fieldProps("message")} />
            {errors.message && (
              <span className="raven-error" id="message-error">
                {errors.message}
              </span>
            )}
          </div>

          {/* Honeypot — hidden from humans, catches bots */}
          <input
            type="text"
            name="botcheck"
            value={form.botcheck}
            onChange={update}
            className="raven-honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <button
            type="submit"
            className="raven-submit"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              "Dispatching the raven…"
            ) : (
              <>
                <span aria-hidden="true">🪶</span> Send the Raven
              </>
            )}
          </button>

          {/* Status messages (announced to screen readers) */}
          <div className="raven-status" role="status" aria-live="polite">
            {status === "success" && (
              <p className="raven-status-msg is-success">
                🕊️ Your raven takes flight! I'll reply within a day or two.
              </p>
            )}
            {status === "mailto" && (
              <p className="raven-status-msg is-success">
                🕊️ Your mail client should be opening — send it off and it'll
                reach me directly.
              </p>
            )}
            {status === "error" && (
              <p className="raven-status-msg is-error">
                The raven faltered mid-flight. Try again, or email me directly at{" "}
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
              </p>
            )}
          </div>
        </motion.form>

        {/* ---- Direct links / "by other means" ---- */}
        <motion.aside
          className="contact-aside"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="contact-aside-card">
            <span className="contact-availability">
              <span className="contact-availability-dot" aria-hidden="true" />
              Open to roles &amp; freelance quests
            </span>
            <h3 className="contact-aside-title">By Other Means</h3>
            <p className="contact-aside-text">
              Prefer to skip the parchment? Reach me directly — I usually answer
              within a day.
            </p>
            <ul className="contact-links">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <span className="contact-link-icon" aria-hidden="true">
                      {l.icon}
                    </span>
                    <span className="contact-link-text">
                      <span className="contact-link-label">{l.label}</span>
                      <span className="contact-link-value">{l.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

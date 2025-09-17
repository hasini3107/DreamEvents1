from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message
from twilio.rest import Client  # ✅ For SMS

app = Flask(__name__)
app.secret_key = "supersecretkey"

# ------------------- Mail Configuration -------------------
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'hasiniunnamatla@gmail.com'
app.config['MAIL_PASSWORD'] = 'upur hxxa dprq evkx'  # Gmail App Password
app.config['MAIL_DEFAULT_SENDER'] = ('Dream Events', 'hasiniunnamatla@gmail.com')

mail = Mail(app)

# ------------------- Twilio Configuration -------------------
TWILIO_ACCOUNT_SID = "ACab114a7310397cdd55093ab04e186561"
TWILIO_AUTH_TOKEN = "3adbf8f99561171e4840c5ea4178d64a"
TWILIO_PHONE_NUMBER = "+18603904160"   # ✅ Fixed: No spaces
MY_PHONE_NUMBER = "+919493474277"      # Your personal number (India +91)

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# ------------------- Routes -------------------

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        message = request.form.get('message')

        print("📩 Contact form data received:")
        print("Name:", name)
        print("Email:", email)
        print("Phone:", phone)
        print("Message:", message)

        # Email content
        body = f"""
        You have a new contact form submission:

        Name: {name}
        Email: {email}
        Phone: {phone}
        Message: {message}
        """

        try:
            # ✅ Send Email
            msg = Message(
                subject="📩 New Contact Form Submission",
                recipients=["hasiniunnamatla@gmail.com"],
                body=body,
                reply_to=email
            )
            mail.send(msg)
            print("✅ Email sent successfully")

            # ✅ Send SMS
            sms_body = f"📩 New Contact Form:\nName: {name}\nEmail: {email}\nPhone: {phone}\nMsg: {message}"
            twilio_client.messages.create(
                body=sms_body,
                from_=TWILIO_PHONE_NUMBER,
                to=MY_PHONE_NUMBER
            )
            print("✅ SMS sent successfully")

            flash("✅ Thank you! Your message has been sent (Email + SMS).", "success")

        except Exception as e:
            print("❌ Error:", str(e))
            flash("❌ Sorry, there was an error sending your message.", "danger")

        return redirect(url_for('contact'))

    return render_template('contact.html')

# 🔹 Test route for Email
@app.route('/test-mail')
def test_mail():
    try:
        msg = Message(
            subject="✅ Test Email from Flask",
            recipients=["hasiniunnamatla@gmail.com"],
            body="This is a test email from your Flask app."
        )
        mail.send(msg)
        print("✅ Test mail sent successfully")
        return "✅ Test mail sent successfully. Check your inbox."
    except Exception as e:
        print("❌ Test mail failed:", str(e))
        return f"❌ Test mail failed: {str(e)}"

# 🔹 Test route for SMS
@app.route('/test-sms')
def test_sms():
    try:
        twilio_client.messages.create(
            body="✅ This is a test SMS from your Flask app.",
            from_=TWILIO_PHONE_NUMBER,
            to=MY_PHONE_NUMBER
        )
        print("✅ Test SMS sent successfully")
        return "✅ Test SMS sent successfully. Check your phone."
    except Exception as e:
        print("❌ Test SMS failed:", str(e))
        return f"❌ Test SMS failed: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True)

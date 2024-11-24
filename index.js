// require("dotenv").config();
// const express = require("express");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const session = require("express-session");

// const app = express();

// // إعداد الجلسة
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET, // مفتاح الجلسة
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000, // يوم واحد
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // إعداد Google Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log("Google Profile:", profile);
//       done(null, profile);
//     }
//   )
// );

// // تخزين واسترجاع بيانات المستخدم في الجلسة
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// // Middleware للتحقق من تسجيل الدخول
// function isLoggedIn(req, res, next) {
//   if (req.user) return next();
//   res.redirect("/");
// }

// // المسارات
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("/profile");
//   }
// );

// app.get("/profile", isLoggedIn, (req, res) => {
//   res.send(`<h1>Welcome, ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
// });

// app.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error("Error logging out:", err);
//       return res.redirect("/");
//     }
//     res.redirect("/");
//   });
// });

// // تشغيل السيرفر
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



























require("dotenv").config();
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const app = express();

// إعداد الجلسة
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // يوم واحد
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// إعداد Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile);
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware للتحقق من تسجيل الدخول
function isLoggedIn(req, res, next) {
  if (req.user) return next();
  res.redirect("/");
}

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.send(`<h1>Home Page</h1><a href="/auth/google">Login with Google</a>`);
});

// مسار تسجيل الدخول عبر Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// صفحة الملف الشخصي
app.get("/profile", isLoggedIn, (req, res) => {
  res.send(`<h1>Welcome, ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
});

// مسار تسجيل الخروج
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // حذف الكوكيز
      res.redirect("/"); // العودة للصفحة الرئيسية
    });
  });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { createRemoteJWKSet, jwtVerify } from "jose";

dotenv.config();

const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 5000;

// setup global cors and json body parsing middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

// create a mongo client
const client = new MongoClient(uri!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// define database collections at the top level
const db = client.db("medi-doc");
const usersCollection = db.collection("users");
const doctorsCollection = db.collection("doctors");
const appointmentsCollection = db.collection("appointments");
const reviewsCollection = db.collection("reviews");
const paymentsCollection = db.collection("payments");
const prescriptionsCollection = db.collection("prescriptions");

// initialize jwks from auth server
const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL || 'http://localhost:3000'}/api/auth/jwks`),
);

// verify token middleware using only const and descriptive Banglish variable names
const verifyToken = async (request: Request, response: Response, next: NextFunction) => {
  const authChabi = request.headers.authorization;
  const mathaToken = (authChabi && authChabi.startsWith("Bearer ")) 
    ? authChabi.split(" ")[1] 
    : null;

  const biskutHeader = request.headers.cookie;
  const sobBiskut: Record<string, string> = biskutHeader 
    ? biskutHeader.split(";").reduce((accumulator: Record<string, string>, cookieString) => {
        const [cookieKey, cookieValue] = cookieString.trim().split("=");
        accumulator[cookieKey] = cookieValue;
        return accumulator;
      }, {}) 
    : {};
  
  const biskutToken = sobBiskut["token"] || null;
  const choltiToken = mathaToken || biskutToken;

  if (!choltiToken) {
    return response.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify the active token
  try {
    // Attempt local JWT secret validation first (cookie-based flow)
    try {
      const khojaUser = jwt.verify(choltiToken, process.env.JWT_SECRET || "medidoc_jwt_secret_key");
      (request as any).user = khojaUser;
      return next();
    } catch (jwtBhul) {
      // Fallback: Validate with JWKS signature directory (Better Auth token flow)
      const { payload: jwksUser } = await jwtVerify(choltiToken, JWKS);
      (request as any).user = jwksUser;
      return next();
    }
  } catch (authBhul) {
    return response.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

// asynchronous connection starter
async function run(): Promise<void> {
  try {
    // connect the client to the server
    await client.connect();
    // send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.error("Database connection failed on startup:", error);
  }
}

// start database connection asynchronously
run().catch(console.dir);

// root route
app.get("/", (req: Request, res: Response) => {
  res.send("Medi-Doc server is running");
});

// login endpoint - generates JWT token and stores in HTTPOnly cookie
app.post("/api/auth/login", async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ error: "Email and password are required" });
    }

    // Find authenticated user record in database
    const milDeyaUser = await usersCollection.findOne({ email });
    if (!milDeyaUser) {
      return response.status(401).json({ error: "Invalid credentials" });
    }

    // Generate signed JWT token
    const bananoToken = jwt.sign(
      { 
        id: milDeyaUser._id.toString(), 
        email: milDeyaUser.email, 
        name: milDeyaUser.name,
        role: milDeyaUser.role || "user"
      },
      process.env.JWT_SECRET || "medidoc_jwt_secret_key",
      { expiresIn: "7d" }
    );

    // Set secure, HTTPOnly cookie in response headers
    const surokkitoBiskut = process.env.NODE_ENV === "production" ? "Secure;" : "";
    response.setHeader(
      "Set-Cookie",
      `token=${bananoToken}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; ${surokkitoBiskut}`
    );

    response.json({ 
      message: "Login successful", 
      user: { 
        id: milDeyaUser._id, 
        email: milDeyaUser.email, 
        name: milDeyaUser.name, 
        role: milDeyaUser.role 
      } 
    });
  } catch (loginBhul) {
    response.status(500).json({ error: "Authentication failed" });
  }
});

// logout endpoint - clears the HTTPOnly token cookie
app.post("/api/auth/logout", (request: Request, response: Response) => {
  const surokkitoBiskut = process.env.NODE_ENV === "production" ? "Secure;" : "";
  response.setHeader(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${surokkitoBiskut}`
  );
  response.json({ message: "Logged out successfully" });
});

// 1. Featured Doctors Endpoint
app.get("/featured", async (req: Request, res: Response) => {
  try {
    const featuredDocs = await doctorsCollection.find({ verificationStatus: "verified" }).limit(6).toArray();
    res.json(featuredDocs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured doctors" });
  }
});

// 2. All Doctors Directory with search & filters
app.get("/doctors", verifyToken, async (req: Request, res: Response) => {
  try {
    const { search, specialization, sort } = req.query as {
      search?: string;
      specialization?: string;
      sort?: string;
    };
    
    let query: any = {};
    if (search) {
      query.$or = [
        { doctorName: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } }
      ];
    }
    if (specialization && specialization !== "All") {
      query.specialization = specialization;
    }

    let doctors = (await doctorsCollection.find(query).toArray()) as any[];

    if (sort === "fee_asc") {
      doctors.sort((a, b) => a.consultationFee - b.consultationFee);
    } else if (sort === "fee_desc") {
      doctors.sort((a, b) => b.consultationFee - a.consultationFee);
    } else {
      // Default: newest first (_id descending)
      doctors.sort((a, b) => b._id.toString().localeCompare(a._id.toString()));
    }

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// 3. Single Doctor Profile
app.get("/doctors/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let doctor: any = null;
    try {
      doctor = await doctorsCollection.findOne({ _id: new ObjectId(id) });
    } catch (_) {}
    if (!doctor) {
      doctor = await doctorsCollection.findOne({ id });
    }
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctor profile" });
  }
});

// 4. Add Doctor Profile
app.post("/doctors", verifyToken, async (req: Request, res: Response) => {
  try {
    const newDoc = req.body;
    const result = await doctorsCollection.insertOne(newDoc);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create doctor profile" });
  }
});

// 5. Update Doctor Profile
app.patch("/doctors/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };
    delete updateData._id; // prevent modifying immutable _id field
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    const result = await doctorsCollection.updateOne(query, { $set: updateData });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update doctor profile" });
  }
});

// 6. Appointments Booking Endpoint
app.post("/appointments", verifyToken, async (request: Request, response: Response) => {
  try {
    const newApt = request.body;
    const result = await appointmentsCollection.insertOne(newApt);
    response.status(201).json(result);
  } catch (error) {
    response.status(500).json({ error: "Failed to book appointment" });
  }
});

// 7. Get User Appointments (both Patient & Doctor logs)
app.get("/appointments/:userId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const query = { $or: [{ patientId: userId }, { doctorId: userId }] };
    const list = await appointmentsCollection.find(query).toArray();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// 8. Delete / Cancel Appointment
app.delete("/appointments/:appointmentId", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.appointmentId;
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    const result = await appointmentsCollection.deleteOne(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

// 9. Get User Prescriptions
app.get("/prescriptions/:userId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const query = { $or: [{ patientId: userId }, { doctorId: userId }] };
    const list = await prescriptionsCollection.find(query).toArray();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

// 10. Add Prescription
app.post("/prescriptions", verifyToken, async (req: Request, res: Response) => {
  try {
    const newRx = req.body;
    const result = await prescriptionsCollection.insertOne(newRx);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create prescription" });
  }
});

// 11. Get Reviews for Doctor
app.get("/reviews/:doctorId", async (req: Request, res: Response) => {
  try {
    const doctorId = req.params.doctorId;
    const list = await reviewsCollection.find({ doctorId }).toArray();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// 12. Add Review
app.post("/reviews", verifyToken, async (req: Request, res: Response) => {
  try {
    const newReview = req.body;
    const result = await reviewsCollection.insertOne(newReview);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

// 13. Get User Payments
app.get("/payments/:userId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const query = { $or: [{ patientId: userId }, { doctorId: userId }] };
    const list = await paymentsCollection.find(query).toArray();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// 14. Add Payment Log
app.post("/payments", verifyToken, async (req: Request, res: Response) => {
  try {
    const newPayment = req.body;
    const result = await paymentsCollection.insertOne(newPayment);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to record payment" });
  }
});

// 15. All Users (Admin overview)
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 16. Delete User by ID
app.delete("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const query = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { id: userId };
    const result = await usersCollection.deleteOne(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 17. Update User Role
app.put("/users/:userId/role", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { role } = req.body;
    const query = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { id: userId };
    const updateDoc = {
      $set: { role },
    };
    const result = await usersCollection.updateOne(query, updateDoc);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user role" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

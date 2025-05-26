import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User as FirebaseUser,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../config/firebase";
import { ModuleProvider } from "./ModuleContext";

// @ts-nocheck

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: FirebaseUser | null;
  projects: Project[];
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  userRole: string;
  userProjects: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("user");
  const [userProjects, setUserProjects] = useState<string[]>([]);

  // const fetchUserData = async (firebaseUser: FirebaseUser) => {
  //   try {
  //     const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       setUserRole(userData.role || "user");
  //       setUserProjects(userData.projects || []);
  //     } else {
  //       // Create new user document if it doesn't exist
  //       await setDoc(doc(db, "users", firebaseUser.uid), {
  //         email: firebaseUser.email,
  //         role: "user",
  //         projects: [],
  //         createdAt: new Date().toISOString(),
  //       });
  //       setUserRole("user");
  //       setUserProjects([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     setUserRole("user");
  //     setUserProjects([]);
  //   }
  // };

  // Comment out fetchProjects and its usage
  // const fetchProjects = async (projectIds: string[]) => {
  //   try {
  //     if (projectIds.length === 0) {
  //       setProjects([]);
  //       return;
  //     }
  //
  //     const projectsQuery = query(
  //       collection(db, "projects"),
  //       where("id", "in", projectIds)
  //     );
  //     const projectsSnapshot = await getDocs(projectsQuery);
  //     const projectsData = projectsSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //       createdAt: doc.data().createdAt?.toDate(),
  //       updatedAt: doc.data().updatedAt?.toDate(),
  //     })) as Project[];
  //     setProjects(projectsData);
  //   } catch (error) {
  //     console.error("Error fetching projects:", error);
  //     setProjects([]);
  //   }
  // };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // await fetchUserData(firebaseUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   if (userProjects.length > 0) {
  //     fetchProjects(userProjects);
  //   } else {
  //     setProjects([]);
  //   }
  // }, [userProjects]);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      //await fetchUserData(result.user);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUserRole("user");
      setUserProjects([]);
      setProjects([]);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    projects,
    loading,
    login,
    logout,
    userRole,
    userProjects,
  };

  return (
    <AuthContext.Provider value={value}>
      <ModuleProvider>{!loading && children}</ModuleProvider>
    </AuthContext.Provider>
  );
};

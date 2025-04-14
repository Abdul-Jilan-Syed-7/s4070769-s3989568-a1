import React, { createContext, useContext, useEffect, useState } from "react";
import { Tutor,DEFAULT_TUTOR } from "../types/tutor";
import { Lecturer,DEFAULT_LECTURER } from "../types/lecturer";

interface AuthContextType {
    tutor: Tutor | null;
    tutors: Tutor[];
    lecturer: Lecturer | null;
    lecturers: Lecturer[];
    login: (email: string, password: string) => boolean;
    login_Admin: (email: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }){
    const [tutor, setUser] = useState<Tutor | null>(null);
    const [tutors, setUsers] = useState<Tutor[]>([]);
    const [lecturer, setAdmin] = useState<Lecturer | null>(null);
    const [lecturers, setAdmins] = useState<Lecturer[]>([]);
    useEffect(() => {
        // Initialize users from localStorage or use defaults
        const storedUsers = localStorage.getItem("users");
        if (!storedUsers) {
          localStorage.setItem("users", JSON.stringify(DEFAULT_TUTOR));
          setUsers(DEFAULT_TUTOR);
        } else {
          setUsers(JSON.parse(storedUsers));
        }
    
        // Check for existing login
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        // Initialize users from localStorage or use defaults
        const storedAdmins = localStorage.getItem("admin");
        if (!storedAdmins) {
          localStorage.setItem("admins", JSON.stringify(DEFAULT_LECTURER));
          setAdmins(DEFAULT_LECTURER);
        } else {
          setAdmins(JSON.parse(storedAdmins));
        }
    
        // Check for existing login
        const storedAdmin = localStorage.getItem("currentAdmin");
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin));
        }
    }, []);

    const login = (email: string, password: string): boolean => {
        const foundUser = tutors.find(
          (u) => u.email === email && u.password === password
        );
    
        if (foundUser) {
          setUser(foundUser);

          localStorage.setItem("currentUser", JSON.stringify(foundUser));
          return true;
        }
        return false;
    };

    const login_Admin = (email: string, password: string): boolean => {
        const foundAdmin = lecturers.find(
          (u) => u.email === email && u.password === password
        );
    
        if (foundAdmin) {
          setAdmin(foundAdmin);

          localStorage.setItem("currentAdmin", JSON.stringify(foundAdmin));
          return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("currentUser");
      };
    
      return (
        <AuthContext.Provider value={{ tutor, tutors, login, logout,lecturer,lecturers,login_Admin }}>
          {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  }
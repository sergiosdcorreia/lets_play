"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { usersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ProfileForm() {
  const { user, setAuth } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    position: user?.position || "",
    skillLevel: user?.skillLevel || 5,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        position: user.position || "",
        skillLevel: user.skillLevel || 5,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await usersApi.updateProfile(formData);
      
      // Update local store
      if (user) {
        setAuth({
          ...user,
          ...response.data.user
        }, localStorage.getItem("auth-token") || "");
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glassmorphism-card backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Preferred Position</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData({ ...formData, position: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Forward">Forward</SelectItem>
                <SelectItem value="Midfielder">Midfielder</SelectItem>
                <SelectItem value="Defender">Defender</SelectItem>
                <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="skillLevel">Skill Level (1-10)</Label>
              <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                {formData.skillLevel}
              </span>
            </div>
            <Slider
              id="skillLevel"
              min={1}
              max={10}
              step={1}
              value={[formData.skillLevel]}
              onValueChange={(value) => setFormData({ ...formData, skillLevel: value[0] })}
              disabled={loading}
              className="py-4"
            />
            <p className="text-xs text-gray-500">
              Rate your football skills from 1 (Beginner) to 10 (Pro)
            </p>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

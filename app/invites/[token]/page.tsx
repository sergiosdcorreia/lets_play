"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { invitesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, X, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

interface TeamInvite {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  team: {
    id: string;
    name: string;
    description: string | null;
    primaryColor: string | null;
    logo: string | null;
  };
  inviter: {
    id: string;
    name: string;
  };
}

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [invite, setInvite] = useState<TeamInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchInvite();
  }, [token]);

  const fetchInvite = async () => {
    try {
      const response = await invitesApi.getInviteByToken(token);
      setInvite(response.data.invite);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load invitation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setProcessing(true);
    setError("");

    try {
      await invitesApi.acceptInvite(token);
      setSuccess(true);

      setTimeout(() => {
        router.push(`/teams/${invite?.team.id}`);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to accept invitation"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async () => {
    setProcessing(true);
    setError("");

    try {
      await invitesApi.declineInvite(token);

      setTimeout(() => {
        router.push("/teams");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to decline invitation"
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => router.push("/teams")}>Go to Teams</Button>
        </div>
      </div>
    );
  }

  if (!invite) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            {invite.team.logo ? (
              <Image
                src={invite.team.logo}
                alt={invite.team.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                style={{
                  backgroundColor: invite.team.primaryColor || "#10b981",
                }}
              >
                {invite.team.name.charAt(0)}
              </div>
            )}
            <div>
              <CardTitle className="text-2xl">
                You&apos;ve Been Invited! 🎉
              </CardTitle>
              <CardDescription>
                {invite.inviter.name} invited you to join their team
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Welcome to the team! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Team Name
              </span>
              <p className="text-lg font-semibold">{invite.team.name}</p>
            </div>

            {invite.team.description && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Description
                </span>
                <p className="text-gray-700">{invite.team.description}</p>
              </div>
            )}

            <div>
              <span className="text-sm font-medium text-gray-500">
                Your Role
              </span>
              <p className="text-lg font-semibold capitalize">{invite.role}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500">
                Invited By
              </span>
              <p className="text-gray-700">{invite.inviter.name}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500">Expires</span>
              <p className="text-gray-700">
                {new Date(invite.expiresAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-4">
          <Button
            onClick={handleDecline}
            variant="outline"
            className="flex-1"
            disabled={processing || success}
          >
            {processing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-2 h-4 w-4" />
            )}
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={processing || success}
          >
            {processing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Accept & Join
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast" // Import useToast

export function TextBeeSettingsDialog() {
  const [apiKey, setApiKey] = useState("")
  const [deviceId, setDeviceId] = useState("")
  const [webhookEndpoint, setWebhookEndpoint] = useState("")
  const [signingSecret, setSigningSecret] = useState("")
  const [loading, setLoading] = useState(true) // Add loading state
  const { toast } = useToast() // Initialize useToast

  useEffect(() => {
    const fetchTextBeeSettings = async () => {
      setLoading(true)
      const adminToken = localStorage.getItem("admin-token") // Get admin token from local storage

      if (!adminToken) {
        toast({
          title: "Authentication Required",
          description: "Please log in as admin to view TextBee settings.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/admin/textbee-settings", {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setApiKey(data.apiKey)
          setDeviceId(data.deviceId)
          setWebhookEndpoint(data.webhookEndpoint)
          setSigningSecret(data.signingSecret)
        } else {
          const errorData = await response.json()
          toast({
            title: "Error",
            description: errorData.error || "Failed to load TextBee settings.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch TextBee settings:", error)
        toast({
          title: "Network Error",
          description: "Could not connect to the server to fetch TextBee settings.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTextBeeSettings()
  }, [toast]) // Add toast to dependency array

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto bg-transparent">
          <Settings className="w-4 h-4 mr-2" />
          TextBee Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>TextBee SMS Gateway Configuration</DialogTitle>
          <DialogDescription>
            These are the TextBee credentials used by the application. They are securely fetched from the server.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Loading settings...</p>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api-key" className="text-right">
                API Key
              </Label>
              <Input id="api-key" value={apiKey} readOnly className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="device-id" className="text-right">
                Device ID
              </Label>
              <Input id="device-id" value={deviceId} readOnly className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="webhook-endpoint" className="text-right">
                Webhook URL
              </Label>
              <Input id="webhook-endpoint" value={webhookEndpoint} readOnly className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="signing-secret" className="text-right">
                Signing Secret
              </Label>
              <Input id="signing-secret" value={signingSecret} readOnly className="col-span-3" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

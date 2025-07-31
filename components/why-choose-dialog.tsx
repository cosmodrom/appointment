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
import { Smartphone, Clock } from "lucide-react"
import { Shield, MessageSquare } from "lucide-react"

export function WhyChooseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          features
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Why Choose This System?</DialogTitle>
          <DialogDescription>
            Discover the benefits of this secure and direct SMS-based appointment management.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-8">
          {/* Benefits Section */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="text-blue-600 h-[30px] w-[30px]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 italic underline">Direct Communication</h3>
                  <p className="text-gray-600 italic">
                    Receive messages directly from your appointer's phone number - no third-party services
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="text-green-600 w-[30px] h-[30px]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 italic underline">Privacy First</h3>
                  <p className="text-gray-600 italic">
                    Your data stays with your appointer - no external SMS providers involved
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="text-purple-600 h-[30px] w-[30px]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 italic underline">Instant Access</h3>
                  <p className="text-gray-600 italic">
                    Quick SMS verification gets you into your appointment portal in seconds
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="text-orange-600 h-[30px] w-[30px]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 italic underline">Mobile Optimized</h3>
                  <p className="text-gray-600 italic">Designed mobile-first for easy access on any device, anywhere</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

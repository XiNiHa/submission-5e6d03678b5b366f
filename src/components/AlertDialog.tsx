import * as AlertDialog from '@radix-ui/react-alert-dialog'
import type React from 'react'

export const Root = AlertDialog.Root
export const Content: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AlertDialog.Portal>
    <AlertDialog.Overlay
      uno-bg="black opacity-40"
      uno-pos="fixed inset-0"
      className="animate__animated animate__fadeIn animate__faster"
    />
    <div uno-pos="fixed inset-0" className="flex-col-center">
      <AlertDialog.Content
        uno-bg="white"
        uno-border="rounded-xl"
        uno-shadow="lg"
        uno-w="[90vw]"
        uno-max-w="[500px]"
        uno-p="8"
        className="animate__animated animate__zoomIn animate__faster"
      >
        {children}
      </AlertDialog.Content>
    </div>
  </AlertDialog.Portal>
)
export const Title: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AlertDialog.Title uno-text="2xl #333 center" uno-font="medium">
    {children}
  </AlertDialog.Title>
)
export const Description: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <AlertDialog.Description uno-m="y-8" uno-text="xl #555 center">
    {children}
  </AlertDialog.Description>
)
export const Action = AlertDialog.Action

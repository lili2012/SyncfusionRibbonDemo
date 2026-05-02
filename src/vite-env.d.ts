/// <reference types="vite/client" />

export {}; // Mark as a module to allow 'declare global'

declare global {
  interface Window {
    encoding: string; 
  }
}
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        incomingLinks: CollectionEntry<"notes">[],
        outgoingLinks: CollectionEntry<"notes">[]
    }
}
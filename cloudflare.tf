terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }
  }
}

provider "cloudflare" {
  
}

variable "account_id" {
  type        = string
}

variable "script_name" {
  type        = string
  default     = "hello-terraform"
}

resource "cloudflare_workers_script" "hello" {
  account_id  = var.account_id
  script_name = var.script_name

  content     = file("${path.module}/worker.js")

  main_module = "worker.js"
}


resource "cloudflare_workers_script_subdomain" "hello" {
  account_id        = var.account_id
  script_name       = cloudflare_workers_script.hello.script_name
  enabled           = true
  previews_enabled  = false
}
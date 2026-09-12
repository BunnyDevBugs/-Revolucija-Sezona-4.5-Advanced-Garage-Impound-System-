<div align="center">

<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2Fed%2F0b%2F5e%2Fed0b5eab42cd6e882a5afb504b458b2d.jpg&f=1&nofb=1&ipt=9c5b83ed7dc11fbe9950838a8154b73c8b04fd3100549a15277bad2f8d381ab6" width="100" height="100" style="border-radius: 50%;">

# ✨ Revolucija Season 4.5: Garage & Impound System
### ⚡ Advanced Vehicle Management & SQL Integration Guide

[![Made by BugsBunnyDev](https://img.shields.io/badge/Made%20by-BugsBunnyDev-7c3aed.svg?style=for-the-badge)](https://github.com)
[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-purple.svg?style=for-the-badge)](https://github.com)

</div>

---

## 📥 Script Download & Video Preview
You can download the script directly in GitHub

### 🎥 Video Preview / Showcase
Click the image below to watch the video preview on YouTube:

[![Revolucija Season 4.5 Preview](https://www.youtube.com/watch?v=Q_UOaShY3n8)

---

## 🚘 1. Garage & Impound SQL Setup (`owned_vehicles`)
To ensure that player vehicles properly sync with the new garage, impound, and police garage systems, ensure your database uses the standard `owned_vehicles` table structure.

* **📍 Database Table:** `owned_vehicles`

```sql
CREATE TABLE IF NOT EXISTS `owned_vehicles` (
  `plate` VARCHAR(12) NOT NULL,
  `citizenid` VARCHAR(50) DEFAULT NULL,
  `vehicle` LONGTEXT DEFAULT NULL,
  `state` INT(11) DEFAULT 1, -- 1 = Out, 0 = In Garage, 2 = Impounded
  `parking` VARCHAR(60) DEFAULT NULL,
  `impound` INT(11) DEFAULT 0,
  PRIMARY KEY (`plate`)
);

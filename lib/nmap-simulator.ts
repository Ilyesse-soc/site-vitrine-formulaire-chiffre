/**
 * Simulateur Nmap pour la démo
 * En production, utilisez subprocess avec Python Flask
 */

interface NmapResult {
  ip: string
  hostname?: string
  ports: Array<{
    port: number
    protocol: string
    service: string
    state: string
    version?: string
  }>
  scanTime: string
}

// Base de données de services communs
const commonServices: Record<number, { service: string; versions: string[] }> = {
  21: { service: "ftp", versions: ["vsftpd 3.0.3", "ProFTPD 1.3.6"] },
  22: { service: "ssh", versions: ["OpenSSH 8.2", "OpenSSH 7.4"] },
  23: { service: "telnet", versions: ["Linux telnetd", "Windows Telnet"] },
  25: { service: "smtp", versions: ["Postfix smtpd", "Exim 4.94"] },
  53: { service: "dns", versions: ["ISC BIND 9.16.1", "dnsmasq 2.80"] },
  80: { service: "http", versions: ["Apache httpd 2.4.41", "nginx 1.18.0"] },
  110: { service: "pop3", versions: ["Dovecot pop3d", "Courier pop3d"] },
  143: { service: "imap", versions: ["Dovecot imapd", "Courier imapd"] },
  443: { service: "https", versions: ["Apache httpd 2.4.41", "nginx 1.18.0"] },
  993: { service: "imaps", versions: ["Dovecot imapd", "Courier imapd"] },
  995: { service: "pop3s", versions: ["Dovecot pop3d", "Courier pop3d"] },
  3306: { service: "mysql", versions: ["MySQL 8.0.25", "MariaDB 10.5.10"] },
  5432: { service: "postgresql", versions: ["PostgreSQL 13.3", "PostgreSQL 12.7"] },
  6379: { service: "redis", versions: ["Redis 6.2.4", "Redis 5.0.7"] },
}

// Profils de scan pour différents types de cibles
const scanProfiles: Record<string, number[]> = {
  "google.com": [80, 443],
  "github.com": [22, 80, 443],
  "stackoverflow.com": [80, 443],
  "cloudflare.com": [80, 443],
  "8.8.8.8": [53], // DNS Google
  "1.1.1.1": [53], // DNS Cloudflare
  default: [22, 80, 443], // Profil par défaut
}

function resolveHostname(target: string): { ip: string; hostname?: string } {
  // Simulation de résolution DNS
  const knownHosts: Record<string, string> = {
    "google.com": "142.250.185.78",
    "github.com": "140.82.113.4",
    "stackoverflow.com": "151.101.1.69",
    "cloudflare.com": "104.16.132.229",
    "example.com": "93.184.216.34",
  }

  if (knownHosts[target]) {
    return { ip: knownHosts[target], hostname: target }
  }

  // Si c'est déjà une IP
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  if (ipRegex.test(target)) {
    return { ip: target }
  }

  // Génère une IP aléatoire pour les domaines inconnus
  const randomIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
  return { ip: randomIp, hostname: target }
}

function generatePorts(
  target: string,
): Array<{ port: number; protocol: string; service: string; state: string; version?: string }> {
  const ports = scanProfiles[target] || scanProfiles["default"]
  const result = []

  for (const port of ports) {
    // 90% de chance que le port soit ouvert
    if (Math.random() > 0.1) {
      const serviceInfo = commonServices[port]
      const service = serviceInfo?.service || "unknown"
      const version = serviceInfo?.versions[Math.floor(Math.random() * serviceInfo.versions.length)]

      result.push({
        port,
        protocol: "tcp",
        service,
        state: "open",
        version,
      })
    }
  }

  // Ajoute parfois des ports supplémentaires
  if (Math.random() > 0.7) {
    const extraPorts = [8080, 8443, 3000, 5000, 9000]
    const extraPort = extraPorts[Math.floor(Math.random() * extraPorts.length)]

    if (!result.find((p) => p.port === extraPort)) {
      result.push({
        port: extraPort,
        protocol: "tcp",
        service: "http-alt",
        state: "open",
      })
    }
  }

  return result
}

export async function simulateNmapScan(target: string): Promise<NmapResult> {
  // Simulation du délai de scan
  await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

  const { ip, hostname } = resolveHostname(target)
  const ports = generatePorts(target)

  // En production avec Python Flask, vous utiliseriez :
  /*
  import subprocess
  import json
  import xml.etree.ElementTree as ET
  
  def run_nmap_scan(target):
      try:
          # Commande nmap sécurisée
          cmd = ['nmap', '-sS', '-O', '-sV', '--top-ports', '1000', '-oX', '-', target]
          
          # Exécution sécurisée
          result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
          
          if result.returncode != 0:
              raise Exception(f"Nmap failed: {result.stderr}")
          
          # Parse XML output
          root = ET.fromstring(result.stdout)
          
          # Extract results
          host = root.find('host')
          if host is None:
              return {"ip": target, "ports": []}
          
          ip = host.find('address').get('addr')
          hostname_elem = host.find('hostnames/hostname')
          hostname = hostname_elem.get('name') if hostname_elem is not None else None
          
          ports = []
          for port in host.findall('.//port'):
              port_id = int(port.get('portid'))
              protocol = port.get('protocol')
              state = port.find('state').get('state')
              service_elem = port.find('service')
              service = service_elem.get('name') if service_elem is not None else 'unknown'
              version = service_elem.get('version') if service_elem is not None else None
              
              if state == 'open':
                  ports.append({
                      'port': port_id,
                      'protocol': protocol,
                      'service': service,
                      'state': state,
                      'version': version
                  })
          
          return {
              'ip': ip,
              'hostname': hostname,
              'ports': ports,
              'scanTime': datetime.now().isoformat()
          }
          
      except subprocess.TimeoutExpired:
          raise Exception("Scan timeout")
      except Exception as e:
          raise Exception(f"Scan error: {str(e)}")
  */

  console.log(`[NMAP SIMULATOR] Scanning ${target} (${ip})...`)
  console.log(`[NMAP SIMULATOR] Found ${ports.length} open ports`)

  return {
    ip,
    hostname,
    ports,
    scanTime: new Date().toISOString(),
  }
}

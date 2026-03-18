export const isValidLocalIP = (ip: string): boolean => {
  // 1. Регулярное выражение для общего формата IPv4 (0.0.0.0 - 255.255.255.255)
  const ipv4Regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
  
  // Если строка вообще не похожа на IP — разворачиваем сразу
  if (!ipv4Regex.test(ip)) return false;

  // 2. Проверка на "наши" локальные подсети (Strict Local Check)
  const isLocal = ip.startsWith('192.168.') || ip.startsWith('10.');
  
  return isLocal;
};
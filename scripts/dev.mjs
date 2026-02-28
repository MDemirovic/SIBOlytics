import { spawn } from 'node:child_process';

const processes = [];
let isShuttingDown = false;

function launch(command, args, name) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  child.on('exit', (code) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    for (const proc of processes) {
      if (proc.pid && proc.pid !== child.pid) {
        proc.kill('SIGINT');
      }
    }
    process.exit(code ?? 0);
  });

  processes.push(child);
  console.log(`[dev] Started ${name}`);
}

function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  for (const proc of processes) {
    if (proc.pid) {
      proc.kill('SIGINT');
    }
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

launch('npm', ['run', 'dev:server'], 'auth server');
launch('npm', ['run', 'dev:client'], 'vite client');

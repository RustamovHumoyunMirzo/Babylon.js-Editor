import { spawn } from "node:child_process";
import electronPath from "electron";

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(electronPath, ["."], {
	env,
	stdio: "inherit",
	windowsHide: false,
});

child.on("close", (code, signal) => {
	if (code === null) {
		console.error(`${electronPath} exited with signal ${signal}`);
		process.exit(1);
	}

	process.exit(code);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
	process.on(signal, () => {
		if (!child.killed) {
			child.kill(signal);
		}
	});
}

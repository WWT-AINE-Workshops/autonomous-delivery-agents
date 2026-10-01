# From Coding Assistants to Autonomous Delivery Agents

A 240-minute hands-on workshop from World Wide Technology.

This repository is your workspace for the workshop. It contains the lab guides and helper scripts, and a small sample app that the labs work on.

## Start here

Do this before the session. The full pre-work guide, with troubleshooting for every step, is [workshop/pre-work.md](workshop/pre-work.md) (also as [pre-work.docx](workshop/pre-work.docx)).

### Step 1: Install git and the GitHub CLI

**Windows users: set up WSL first.** The workshop does not run in PowerShell or CMD. Open PowerShell as an administrator (right-click it, then choose Run as administrator) and run this:

```powershell
wsl --install
```

What this does: turns on Windows Subsystem for Linux and installs Ubuntu. It needs a restart, and leaves your Windows files alone.

Restart your computer when it asks. Then open Ubuntu from the Start menu, pick a username and password, and wait for the prompt to appear. From here on, type everything in that Ubuntu window, and follow the **Linux and WSL** commands below. Microsoft's guide is at https://learn.microsoft.com/en-us/windows/wsl/install. Keep your work in your Linux home folder, not under `/mnt/c`, because it is faster and avoids permission problems.

**How to do it.**

1. Install **git**.
   - **macOS:** run `xcode-select --install`, or `brew install git` if you use Homebrew (https://brew.sh).
   - **Linux and WSL:**

     ```bash
     sudo apt-get update && sudo apt-get install -y git curl build-essential
     ```

     What this does: refreshes the list of Ubuntu packages and installs git and curl, plus the compilers some packages need. It asks for your password because it uses `sudo`.

   - Tell git who you are. Use your own name and email.

     ```bash
     git config --global user.name "Your Name"
     ```

     What this does: sets the name git puts on your commits, for every repository on this computer. It changes no files in any repository.

     ```bash
     git config --global user.email you@example.com
     ```

     What this does: sets the email address git puts on your commits, for every repository on this computer. It changes no files in any repository.

2. Install the **GitHub CLI**.
   - **macOS:** if you have Homebrew, run the command below. If you do not, either install Homebrew first from https://brew.sh (it needs administrator rights), or download the GitHub CLI installer from https://cli.github.com.

     ```bash
     brew install gh
     ```

     What this does: installs the GitHub CLI, `gh`, with Homebrew. It does not sign you in.

   - **Linux and WSL:** the official apt instructions are at https://github.com/cli/cli/blob/trunk/docs/install_linux.md. For Ubuntu and Debian, paste this whole block as one command:

     ```bash
     (type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) && sudo mkdir -p -m 755 /etc/apt/keyrings && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg && sudo mkdir -p -m 755 /etc/apt/sources.list.d && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null && sudo apt update && sudo apt install gh -y
     ```

     What this does: adds GitHub's package source and its signing key to apt, then installs `gh`. It asks for your password because it uses `sudo`, and it does not sign you in.

3. Open a **new terminal window** so your shell picks up the changes, then check each tool.

   ```bash
   git --version
   ```

   What this does: prints the version of git on your PATH. It changes nothing.

   ```bash
   gh --version
   ```

   What this does: prints the version of `gh`. It changes nothing.

### Step 2: Sign in to GitHub

**How to do it.**

1. Sign in to GitHub. Run this and answer the prompts. Choose **GitHub.com**, then **HTTPS**. When it asks "Authenticate Git with your GitHub credentials?", answer **Yes**. Then choose to sign in with a **web browser**. `gh` shows a one-time code and waits for you to press Enter before it opens your browser. Type the code there. If no browser opens (common in WSL), copy the URL that `gh` prints into a browser on Windows.

   ```bash
   gh auth login
   ```

   What this does: signs the GitHub CLI in to your GitHub account and stores its token on this computer. Because you answer yes to authenticating git, git uses it too when it pushes. It changes no repository.

2. Check that it worked.

   ```bash
   gh auth status
   ```

   What this does: shows which GitHub account `gh` is signed in to. It changes nothing.

### Step 3: Install Node.js

**How to do it.** Install **Node.js 24 LTS** (24.15 or later). Node 22 (22.22.2 or later) and Node 26 also pass the check, but 24 is the one we tested. On Windows, run these in your Ubuntu window and use the Linux and WSL command.

- **macOS:** download the installer from https://nodejs.org/en/download, or with Homebrew run these two commands:

  ```bash
  brew install node@24
  ```

  What this does: installs Node 24, with its npm, with Homebrew. It does not remove any other Node you have.

  ```bash
  brew link --overwrite --force node@24
  ```

  What this does: puts that Node 24 on your PATH, in place of whichever Node Homebrew linked before. It changes no project files.

- **Linux and WSL:** the Node.js download page offers nvm, a small tool that installs Node for you. Copy the current nvm command from https://nodejs.org/en/download, which looks like this:

  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
  ```

  What this does: installs nvm in your home folder and adds it to your shell's start-up file. It installs no Node yet.

  Close the terminal and open a new one. Then install Node:

  ```bash
  nvm install 24
  ```

  What this does: downloads Node 24, with its npm, into nvm's folder and makes it the one your terminal uses.

Open a **new terminal window**, then check it.

```bash
node --version
```

What this does: prints the version of Node on your PATH. It changes nothing.

Check npm too. It comes with Node, and the workshop needs npm 11 or later.

```bash
npm --version
```

What this does: prints the version of npm on your PATH. It changes nothing.

If it prints a number below 11, which is usual with Node 22, update npm:

```bash
npm install -g npm@11
```

What this does: replaces the npm that came with this Node with npm 11. It changes no project files, and leaves Node itself alone.

### Step 4: Install the Claude desktop app and sign in

The labs run in the Code tab of the Claude desktop app. Claude Code needs a Pro, Max, Ultra, Team or Enterprise plan.

1. Download and install the Claude desktop app from https://code.claude.com/docs/en/desktop-quickstart (on Linux, https://code.claude.com/docs/en/desktop-linux).
2. Open Claude, and sign in with your Anthropic account.
3. Click **Code** at the top of the sidebar.

You are done when you are signed in and the Code tab opens. You do not need Node.js or a separate command to use the Code tab.

On Windows, the scripts in this repository run in WSL, and the Code tab runs on Windows. If the Code tab cannot open your WSL folder, install the optional command-line tool below and tell the facilitator.

**Optional: the command-line tool.** The labs never need it.

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

What this does: installs Claude Code for your user account only. It changes no repository.

### Step 5: Make your copy of the workshop repository

**How to do it.** Run these two commands, one at a time, in the folder where you want the project to live. On WSL, that is your Linux home folder.

1. Clone the workshop repository into a folder called `my-autonomous-delivery-agents`.

   ```bash
   git clone https://github.com/WWT-AINE-Workshops/autonomous-delivery-agents.git my-autonomous-delivery-agents
   ```

   What this does: downloads the workshop repository, with its full history and its lab starting points, into a new folder called `my-autonomous-delivery-agents`. Nothing else on your computer changes.

2. Move into the folder.

   ```bash
   cd my-autonomous-delivery-agents
   ```

   What this does: moves your terminal into that folder. It changes nothing.

Stay in the `my-autonomous-delivery-agents` folder for every step below. Now choose one of two paths.

**Quick: run the setup script.**

```bash
./scripts/setup-workshop.sh
```

What this does: walks you through the rest of the pre-work. It makes your private copy on GitHub, installs the app and its tools, and checks your setup. If the workshop has GitHub issues for the labs, it also creates its labels and issues in your copy, and makes your copy the repository `gh` uses in this folder. Before each step it says what the step changes, then asks `Run it? [Y/n]`, so you can skip any step and do it by hand. It installs no tools and never asks for a password of its own, though git may ask you to sign in when it pushes. To answer yes to every question, run `./scripts/setup-workshop.sh --yes` instead.

When it ends with `Setup finished.`, the pre-work is done. If it ends with `Setup finished, with skipped steps:`, or stops on a step, do those steps by hand below.

**By hand.** Run these two commands, then carry on with the next step.

3. Remove the link back to the workshop repository.

   ```bash
   git remote remove origin
   ```

   What this does: deletes only your clone's pointer to the workshop's GitHub URL, which git calls `origin`. No commits, branches, tags or files are removed. The next command sets `origin` again, to your own private repository.

4. Create your private copy on GitHub and push to it.

   ```bash
   gh repo create my-autonomous-delivery-agents --private --source . --remote origin --push
   ```

   What this does: creates a private repository called `my-autonomous-delivery-agents` in your GitHub account, points `origin` at it and pushes your current branch, `main`, with its full history. It does not push the lab starting points: they stay in your clone, and the reset script fetches any that are missing from the workshop's URL.

### Step 6: Check your setup

**How to do it.** The setup script runs this check for you. On the by-hand path, run it in the `my-autonomous-delivery-agents` folder, then read the output. Each line starts with a mark: a tick means ready, a warning means fix it if you can, a cross means it must be fixed.

```bash
./scripts/check-setup.sh
```

What this does: only reads and reports. It checks your tools, their versions and the ports the app needs, and changes nothing.

The script may warn that a program is not set up until the next steps, or that a port the app needs is in use. Fix a busy port by closing the program that uses it.

### Step 7: Install the app and its tools

**How to do it.** The setup script does this step for you. On the by-hand path, run these one at a time, from the `my-autonomous-delivery-agents` folder. The first can take a few minutes.

1. Install the project's packages with `npm ci`, which installs exactly what the lock file lists and never changes it, so your copy stays clean for `./scripts/reset-lab.sh`. A warning from npm about install scripts is expected and harmless.

   ```bash
   npm ci
   ```

   What this does: installs the exact package versions from `package-lock.json` into `node_modules`, without changing the lock file or any other file git tracks.

2. Set up the app's data and helper tools. Run each of these in order.

   ```bash
   npm run setup
   ```

   What this does: runs one of the app's setup commands, which prepares it for the labs (for example its local data). It changes no file git tracks.

### Step 8: Install the test browser

**How to do it.** The setup script installs the browser for you, without the Linux system libraries: if the browser will not start on Linux or WSL, run the Linux and WSL command below yourself. On the by-hand path, run the command for your computer from the repository folder.

- **macOS:**

  ```bash
  npx playwright install chromium
  ```

  What this does: downloads the Chromium browser the tests drive into Playwright's own folder, outside the repository. It changes no repository files.

- **Linux and WSL**, which adds the `--with-deps` option to install the system libraries the browser needs. It asks for your password:

  ```bash
  npx playwright install --with-deps chromium
  ```

  What this does: the same download, plus the system libraries the browser needs, which it installs with `sudo`. It changes no repository files.

Run the check again.

```bash
./scripts/check-setup.sh
```

What this does: only reads and reports, as before. It changes nothing.

## Open the workshop guide

**[workshop/README.md](workshop/README.md)** has the agenda and links to every lab.

Fell behind during the session? `./scripts/reset-lab.sh <lab number>` puts you at the start of any lab.

---

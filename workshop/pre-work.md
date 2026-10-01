# Pre-work for From Coding Assistants to Autonomous Delivery Agents

Do this before the session. It takes about **30 to 45 minutes**, and most of that is waiting for downloads. In the session you will start working in the first few minutes, so a ready laptop matters.

When you finish, you will have the tools installed and your own private copy of the workshop repository, with the app set up on your machine. You do not need to know the topic yet.

**What you need.** A laptop where you can install software, an internet connection, and a GitHub account. For Claude Code you also need a Claude account with a plan that includes it. The docs list the sign-in options, so read their authentication page before you start: https://code.claude.com/docs/en/authentication.

**Where to type commands.** The labs run in the Claude desktop app, in its Code tab. The setup commands below run in a terminal. On macOS that is the Terminal app. On Linux it is your terminal. On Windows you use WSL, a Linux terminal inside Windows, and the first step shows how to set it up. Lines in grey boxes are commands: copy one box at a time, paste it into the terminal and press Enter.

**Version numbers will differ.** Your numbers will not match the examples exactly. That is fine.

## Step 1: Install git and the GitHub CLI

**Who does it:** Everyone.

**Why it matters:** The labs use git to track changes and the GitHub CLI (`gh`) to create your own copy of the workshop repository.

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

**Done when:** both commands print a version number.

**If you get stuck.**

- `wsl --install` needs a restart and may need administrator rights, so allow extra time on Windows.
- Your company laptop blocks installs: ask your IT team, or bring a personal laptop. Tell the facilitator ahead of time and we will find a way.
- On another Linux distribution, install the same tools with your package manager. The links above have instructions.

## Step 2: Sign in to GitHub

**Who does it:** Everyone.

**Why it matters:** The GitHub CLI creates your copy of the repository, so it needs your account.

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

**Done when:** `gh auth status` says you are logged in to github.com.

**If you get stuck.**

- `gh auth login` keeps asking for a code: copy the code exactly, including the dash, into the page your browser opened.
- If your company signs in to GitHub with single sign-on, you may need to authorize the GitHub CLI for your organization. This workshop only uses your personal account.

## Step 3: Install Node.js

**Who does it:** Everyone.

**Why it matters:** The workshop app and its tests run on Node.js.

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

**Done when:** `node --version` prints a version number, and `npm --version` prints 11 or later. v24 is recommended; 22.22.2 or later and 26 or later also pass.

**If you get stuck.**

- `node --version` shows an older number after installing: you have a second copy of Node. Open a new terminal. With nvm, run `nvm use 24`.
- `npm install -g` fails with a permission error: your Node was installed for all users. Install Node with nvm or Homebrew as above, which needs no `sudo`, then run it again.

## Step 4: Install the Claude desktop app and sign in

**Who does it:** Everyone.

**Why it matters:** The labs run in the Code tab of the Claude desktop app. It needs your account before it will answer anything. Claude Code needs a Pro, Max, Ultra, Team or Enterprise plan. Read the authentication page first, and ask your team admin if you are not sure which sign-in applies to you: https://code.claude.com/docs/en/authentication.

**How to do it.**

1. Download and install the Claude desktop app. The download links for macOS and Windows are on the desktop quick start page: https://code.claude.com/docs/en/desktop-quickstart. On Linux, follow https://code.claude.com/docs/en/desktop-linux.

2. Open Claude, and sign in with your Anthropic account.

3. Click **Code** at the top of the sidebar. If the app asks you to choose an environment or a folder, you will do that in Step 5. For now it is enough that the Code tab opens.

**What you should see.** The app is signed in, and the Code tab shows a place to start a session.

**Done when:** you are signed in to the Claude desktop app and can open the Code tab. You do not need Node.js or a separate command to use the Code tab.

**If you get stuck.**

- The Code tab is missing: update the app to the latest version and restart it.
- Your sign-in does not offer Claude Code: your plan may not include it. Ask your team admin, and tell the facilitator before the session.
- On Windows, the scripts in the repository run in WSL, and the Code tab runs on Windows. If the Code tab cannot open your WSL folder, use the optional command-line install below instead, and tell the facilitator.

**Optional: also install the command-line tool.** The labs never need it. If you want it, for example to run an agent from a script, install it from a terminal. It works on macOS, Linux and WSL.

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

What this does: downloads Anthropic's installer and installs Claude Code for your user account only. It changes no repository.

Open a new terminal window, then check the install.

```bash
claude --version
```

What this does: prints the version of Claude Code on your PATH. It changes nothing.

If `claude: command not found` appears, the install folder is not on your PATH yet. Open a new terminal and try again. If it still fails, see the install troubleshooting page: https://code.claude.com/docs/en/troubleshoot-install. To leave an interactive session in the terminal, press `Ctrl+D` twice on an empty prompt.

## Step 5: Make your copy of the workshop repository

**Who does it:** Everyone.

**Why it matters:** You get your own private repository, so you can commit, push and open pull requests without touching anyone else's. Cloning keeps the full commit history, so do not use GitHub's fork button.

**Why a private copy and not a fork.** A fork of a public repository is public, and GitHub does not let you make it private. In a fork, the GitHub CLI can pick the workshop repository instead of yours when you work with issues or pull requests. Some companies do not allow forks at all. And you lose nothing by not forking: the labs fetch their starting points straight from the workshop's URL, so your copy needs no link back to the workshop repository.

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

When it ends with `Setup finished.`, the pre-work is done: go to the checklist at the end. If it ends with `Setup finished, with skipped steps:`, or stops on a step, do those steps by hand below.

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

**Done when:** the setup script ended with `Setup finished.`, or the last command finished without an error. Either way, the new repository shows up at `github.com/<your user name>/my-autonomous-delivery-agents`.

**If you get stuck.**

- `Repository not found` on the clone: check your network and try again. If it still fails, tell the facilitator.
- The setup script says a tool is missing: install it with the command it shows, or with the steps above. Open a new terminal, then run the script again. It skips the steps that are already done.
- `Name already exists on this account`: you have a repository called `my-autonomous-delivery-agents` already. Rename or delete that one on GitHub, or pick another name. To pick another name, run this, with the name you want in place of `<another name>`:

  ```bash
  ./scripts/setup-workshop.sh --name <another name>
  ```

  What this does: runs the setup again with the new name. It skips the steps that are already done.

  Or put the other name in the last command.

- `fatal: destination path 'my-autonomous-delivery-agents' already exists`: you cloned before. Run `cd my-autonomous-delivery-agents` and continue from there, or delete the folder and start again.

## Step 6: Check your setup

**Who does it:** Everyone.

**Why it matters:** One script checks everything above at once and tells you how to fix anything missing.

**How to do it.** The setup script runs this check for you. On the by-hand path, run it in the `my-autonomous-delivery-agents` folder, then read the output. Each line starts with a mark: a tick means ready, a warning means fix it if you can, a cross means it must be fixed.

```bash
./scripts/check-setup.sh
```

What this does: only reads and reports. It checks your tools, their versions and the ports the app needs, and changes nothing.

The script may warn that a program is not set up until the next steps, or that a port the app needs is in use. Fix a busy port by closing the program that uses it.

**Done when:** the last line says `Ready for the workshop.` If something is still missing, the next steps install it, and you run the check once more at the end.

**If you get stuck.**

- Each cross line says what is wrong and the command that fixes it. Run that command, then run the script again.
- `Permission denied`: run `chmod +x scripts/*.sh`, then try again.
- If you installed the optional command-line tool, you can check its sign-in as well by adding the `--live` option. It sends one tiny request, so it needs a working sign-in:

  ```bash
  ./scripts/check-setup.sh --live
  ```

  What this does: the same check, plus one short request to Claude Code to prove you are signed in. It changes no files.

## Step 7: Install the app and its tools

**Who does it:** Everyone.

**Why it matters:** The labs run the app and its tests, so they need its packages and its starting data.

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

**Done when:** `npm ci` and the setup commands finish without an error. The next step installs the test browser and runs the check again.

**If you get stuck.**

- `npm ci` fails with an error that mentions `node-gyp` or a compiler: a build tool is missing. On macOS run `xcode-select --install`. On Linux and WSL, run `sudo apt-get install -y build-essential python3`. Then run `npm ci` again.
- `npm ci` warns about the engine or Node version: run `node --version`. You need 22.22.2 or later, and we recommend 24.
- Anything else: run the command once more and read the first error line, not the last.

## Step 8: Install the test browser

**Who does it:** Everyone.

**Why it matters:** The labs run browser tests, and Claude can drive a browser for screenshots. Run this inside your copy of the repository, after the packages are installed, so you get the browser version the project expects.

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

**Done when:** the check shows a tick for Playwright Chromium and ends with `Ready for the workshop.`

**If you get stuck.**

- The step stalls on Linux or WSL: use the Linux and WSL command above and enter your password when `sudo` asks.

## Before the session checklist

Tick each box.

- [ ] Windows only: WSL is installed, and I type everything in the Ubuntu window.
- [ ] `git --version` and `gh --version` print a version.
- [ ] `node --version` prints v24 (or v22.22.2 or later, or v26), and `npm --version` prints 11 or later.
- [ ] `gh auth status` says I am logged in.
- [ ] I am signed in to the Claude desktop app, and the Code tab opens. (Optional: `claude --version` prints a version.)
- [ ] My private `my-autonomous-delivery-agents` repository exists on GitHub.
- [ ] `./scripts/check-setup.sh` ends with `Ready for the workshop.`
- [ ] I will bring my laptop, charger and an internet connection.
- [ ] I know who to ask for help if something in this list fails: the facilitator.

If one box will not tick, do not wait. Tell the facilitator before the session what the error says.

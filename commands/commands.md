# Command Reference Guide

## Homebrew Installation and Management
### Basic Installation
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Configure Homebrew PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Core Homebrew Commands
```bash
# Package Management
brew install <package>          # Install a package
brew uninstall <package>        # Remove a package
brew list                      # List installed packages
brew search <package>          # Search for packages
brew info <package>            # Show package info
brew cleanup                   # Clean up old versions
brew uninstall --force <package> # Force uninstall package

# Version Management
brew switch <package> <version> # Switch between versions
brew pin <package>             # Prevent package upgrades
brew unpin <package>           # Allow package upgrades
brew link <package>            # Link package
brew unlink <package>          # Unlink package

# Dependency Management
brew deps <package>            # Show package dependencies
brew dependents <package>      # Show dependent packages
brew leaves                    # Show packages not dependencies

# System Management
brew update                    # Update Homebrew
brew upgrade                   # Upgrade all packages
brew doctor                    # Diagnose issues
brew outdated                  # List outdated packages
brew config                    # Show Homebrew configuration
brew analytics off            # Disable analytics

# Services
brew services start <package>  # Start a service
brew services stop <package>   # Stop a service
brew services restart <package># Restart a service
brew services list            # List all services

# Repository Management
brew tap <repository>         # Add third-party repository
brew untap <repository>       # Remove repository
```

## Python Installation and Management
### Python Installation
```bash
# Install specific Python versions
brew install python@3.11
brew uninstall python@3.13    # Remove specific version
brew list | grep python       # List installed Python versions

# Check Python locations
which -a python3              # Show all Python installations
python3 --version             # Check current Python version
/opt/homebrew/bin/python3.11 --version  # Check specific version
```

### Python Package Management
```bash
# Basic pip commands
python3 -m pip install <package>
python3 -m pip uninstall <package>
python3 -m pip list
python3 -m pip show <package>
python3 -m pip install --upgrade pip
python3 -m pip check          # Check dependencies

# Version-specific installation
python3.11 -m pip install <package>
python3.11 -m pip list

# Requirements management
pip install pip-chill
pip-chill > requirements.txt
python3 -m pip freeze > requirements.txt
python3 -m pip install -r requirements.txt

# System information
python3 -m site              # Show site-packages paths
python3 -m sysconfig         # Show configuration
python3 -m platform          # Show platform info
```

## Virtual Environment Management
### Basic venv Commands
```bash
# Create and manage virtual environments
python3 -m venv myenv
source myenv/bin/activate
deactivate
rm -rf myenv                 # Delete environment

# For specific Python version
python3.11 -m venv venv
source venv/bin/activate

# VS Code Python selection
# Cmd+Shift+P -> "Python: Select Interpreter"
```

### Jupyter Integration
```bash
# Setup Jupyter kernel in venv
pip install ipykernel
python -m ipykernel install --user --name=venv --display-name "Python (venv)"
jupyter kernelspec list

# JupyterLab service management
brew services start jupyterlab
brew services stop jupyterlab
rm ~/Library/LaunchAgents/homebrew.mxcl.jupyterlab.plist  # Reset plist
brew uninstall jupyterlab
brew install jupyterlab
```

## Docker Commands
```bash
# Installation and basic usage
brew install --cask docker
open /Applications/Docker.app
docker run hello-world

# Container Management
docker ps                    # List running containers
docker ps -a                 # List all containers
docker start <container>     # Start container
docker stop <container>      # Stop container
docker rm <container>        # Remove container

# Image Management
docker images               # List images
docker pull <image>         # Pull image
docker rmi <image>          # Remove image
docker build -t <name> .    # Build image from Dockerfile

# Network and Volume
docker network ls           # List networks
docker volume ls           # List volumes
```

## Git Commands
```bash
# Repository initialization
git init
git add .
git commit -m "Initial commit"

# Remote repository management
git remote add origin <repository-url>
git remote set-url origin <repository-url>
git push -u origin main

# Branch management
git branch                  # List branches
git branch <name>          # Create branch
git checkout <branch>      # Switch branches
git merge <branch>         # Merge branch

# Status and history
git status                 # Show working tree status
git log                    # Show commit history
git diff                   # Show changes

# Remove from tracking
git rm -r --cached <folder-name>
git reset HEAD <file>      # Unstage file

# Stash changes
git stash                  # Stash changes
git stash pop             # Apply stashed changes
```

## Ollama Commands
```bash
# Installation and usage
brew install ollama
brew services start ollama
ollama pull phi4

# Model management
ollama list               # List installed models
ollama rm <model>         # Remove model
ollama run <model>        # Run model

# Access model directory
cd ~/.ollama/models
```

## Path Management
```bash
# Update PATH
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Check current PATH
echo $PATH

# Add to specific shell configs
echo 'export PATH="$PATH:/new/path"' >> ~/.bash_profile
echo 'export PATH="$PATH:/new/path"' >> ~/.zshrc

# Reload shell configuration
source ~/.zshrc
source ~/.bash_profile
```

## System Commands
```bash
# Directory Navigation
pwd                       # Print working directory
ls -la                    # List all files with details
cd -                      # Go to previous directory
pushd <dir>              # Push directory to stack
popd                     # Pop directory from stack

# File Operations
cp -r <src> <dst>        # Copy recursively
mv <src> <dst>           # Move/rename
rm -rf <dir>             # Remove directory
chmod +x <file>          # Make file executable

# Process Management
ps aux | grep <process>  # Find process
kill <pid>               # Kill process
top                      # Show processes
htop                     # Interactive process viewer

# Network
netstat -an              # Show network connections
lsof -i :<port>         # Show process using port
curl -I <url>           # Show HTTP headers
wget <url>              # Download file
```
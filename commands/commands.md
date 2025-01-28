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

# System Management
brew update                    # Update Homebrew
brew upgrade                   # Upgrade all packages
brew doctor                    # Diagnose issues
brew outdated                  # List outdated packages

# Services
brew services start <package>  # Start a service
brew services stop <package>   # Stop a service
brew services restart <package># Restart a service
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
```

### Python Package Management
```bash
# Basic pip commands
python3 -m pip install <package>
python3 -m pip uninstall <package>
python3 -m pip list
python3 -m pip show <package>
python3 -m pip install --upgrade pip

# Requirements management
pip install pip-chill
pip-chill > requirements.txt
python3 -m pip freeze > requirements.txt
python3 -m pip install -r requirements.txt
```

## Virtual Environment Management
### Basic venv Commands
```bash
# Create and manage virtual environments
python3 -m venv myenv
source myenv/bin/activate
deactivate

# For specific Python version
python3.11 -m venv venv
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
```

## Docker Commands
```bash
# Installation and basic usage
brew install --cask docker
open /Applications/Docker.app
docker run hello-world
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

# Remove from tracking
git rm -r --cached <folder-name>
```

## Ollama Commands
```bash
# Installation and usage
brew install ollama
brew services start ollama
ollama pull phi4

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
```
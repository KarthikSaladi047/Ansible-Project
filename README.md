# Automated Deployment and Configuration Management of a <img src="https://github.com/devicons/devicon/blob/master/icons/linux/linux-original.svg" title="linuxlinux" alt="linux" width="40" height="40"/>&nbsp; Web Server on <img src="https://github.com/devicons/devicon/blob/master/icons/azure/azure-original.svg" title="azure" alt="azure" width="40" height="40"/>&nbsp;using <img src="https://github.com/devicons/devicon/blob/master/icons/ansible/ansible-original-wordmark.svg"  title="ansibleansible" alt="ansible" width="40" height="40"/>&nbsp; and <img src="https://github.com/devicons/devicon/blob/master/icons/terraform/terraform-original.svg" title="terraform" alt="terraform" width="40" height="40"/>&nbsp;

## Introduction:

- This project focuses on building and maintaining a configuration management system using Ansible and Terraform to provision a Linux VM on Azure. The goal of this project is to automate the deployment and configuration of a Linux web server on Azure, making it easier to manage and scale the system. The target audience for this project is system administrators and IT professionals who are responsible for deploying and maintaining web servers on cloud platforms.

- The system architecture includes a Linux VM on Azure as the primary server, and Ansible as the configuration management tool. Terraform is used to provision the Linux VM on Azure. The system is designed to be highly available, secure, and easily scalable. The system is deployed on Azure and all the dependencies are handled by Terraform. The system can be updated and maintained using the Ansible playbooks.

- This project assumes that the user has an Azure subscription, and has access to Azure resources and permissions to provision resources. Additionally, the user should have a basic knowledge of Ansible and Terraform and should have them installed on the local machine.

## Architecture:
The overall architecture of this project consists of three main components:

- **Linux VM on Azure**: The Linux VM on Azure serves as the primary server for the web application. This VM is provisioned using Terraform, and is configured with all the necessary dependencies and software.

- **Ansible**: Ansible is used as the configuration management tool in this project. It is used to automate tasks and manage the configuration of the Linux VM on Azure. Ansible playbooks are used to define the desired state of the system and apply the necessary changes.

- **Terraform**: Terraform is used to provision the Linux VM on Azure. It is used to define the Azure resources required for the system and to automate the process of creating and configuring the resources.

The system is designed to be highly available, secure, and easily scalable. Terraform is used to create and manage the infrastructure on Azure and Ansible is used to configure and manage the Linux VM. The system can be easily updated and maintained using the Ansible playbooks.

The following diagram illustrates the architecture of the system:



The Linux VM on Azure is provisioned using Terraform and configured using Ansible. The system can be easily updated and maintained using the Ansible playbooks.

## Tools and Technologies:
This project uses the following tools and technologies:

1. **Ansible**: Ansible is an open-source configuration management tool that can be used to automate the deployment and management of software on multiple servers. In this project, Ansible is used to manage the configuration of the Linux VM on Azure.

2. **Terraform**: Terraform is an open-source infrastructure as code software tool that allows to create, manage and provision infrastructure resources through code. In this project, Terraform is used to provision the Linux VM on Azure and manage the infrastructure resources on Azure.

3. **Azure**: Azure is a cloud computing service created by Microsoft for building, deploying, and managing applications and services through a global network of Microsoft-managed data centers. In this project, Azure is used as the cloud platform to provision the Linux VM and manage the infrastructure resources.

4. **Linux**: The project uses Linux as the operating system for the virtual machine.

5. **Nginx** : Nginx is a web server that can also be used as a reverse proxy, load balancer, and HTTP cache. In this project, Nginx is used as the web server.

These tools and technologies are widely used in the industry and are well-documented, making it easy to find resources and tutorials for learning and troubleshooting.

## Setup and Installation: 
```
wget https://releases.hashicorp.com/terraform/0.15.5/terraform_0.15.5_linux_amd64.zip
unzip terraform_0.15.5_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```
```
sudo apt-add-repository ppa:ansible/ansible
sudo apt update
sudo apt install ansible
```
## Configuration Management using Ansible:
```
- name: Install and configure Nginx
  hosts: all
  become: true
  tasks:
    - name: Install Nginx
      apt: pkg=nginx state=installed update_cache=true

    - name: Start Nginx
      service: name=nginx state=started enabled=true

    - name: Copy HTML file
      copy: src=index.html dest=/var/www/html/index.html
      
- name: Verify Nginx is running
  hosts: all
  become: true
  tasks:
    - name: Check Nginx status
      shell: systemctl status nginx

- name: Verify HTML page is served
  hosts: all
  become: true
  tasks:
    - name: curl to check if HTML page is served
      shell: curl http://localhost
```

## Provisioning a Linux VM on Azure using Terraform:
```
provider "azurerm" {
  version = "=2.23.0"
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "myResourceGroup"
  location = "westus2"
}

resource "azurerm_virtual_network" "vnet" {
  name                = "myVnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "mySubnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefix       = "10.0.1.0/24"
}

resource "azurerm_network_interface" "nic" {
  name                = "myNIC"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "myIPConfig"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "dynamic"
  }
}

resource "azurerm_storage_account" "sa" {
  name                     = "mystorageaccount"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "container" {
  name                  = "mycontainer"
  storage_account_name  = azurerm_storage_account.sa.name
  container_access_type = "private"
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                  = "myVM"
  location              = azurerm_resource_group.rg.location
  resource_group_name   = azurerm_resource_group.rg.name
  network_interface_ids = [azurerm_network_interface.nic.id]
  vm_size               = "Standard
  
  admin_ssh_key {
    username   = "adminuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "16.04-LTS"
    version   = "latest"
  }
  
  provisioner "local-exec" {
    command = "ansible-playbook -i '${azurerm_linux_virtual_machine.vm.private_ip},' playbook.yml"
  }
}
```
## Execution and Deployment: 

## Maintenance and Updates: 

## Troubleshooting:

## Conclusion:

# Automated Deployment and Configuration Management of a <img src="https://github.com/devicons/devicon/blob/master/icons/apache/apache-original-wordmark.svg" title="apache" alt="apache" width="40" height="40"/> Web Server on <img src="https://github.com/devicons/devicon/blob/master/icons/azure/azure-original.svg" title="azure" alt="azure" width="40" height="40"/> using <img src="https://github.com/devicons/devicon/blob/master/icons/ansible/ansible-original-wordmark.svg"  title="ansible" alt="ansible" width="40" height="40"/> and <img src="https://github.com/devicons/devicon/blob/master/icons/terraform/terraform-original.svg" title="terraform" alt="terraform" width="40" height="40"/>

## Introduction:

- ***This project focuses on building and maintaining a configuration management system using Ansible and Terraform to provision a Linux VM on Azure. The goal of this project is to automate the deployment and configuration of a Apache web server on Azure, making it easier to manage and scale the system.***

- The system architecture includes a Linux VM on Azure as the primary server, and Ansible as the configuration management tool. Terraform is used to provision the Linux VM on Azure. The system is designed to be highly available, secure, and easily scalable. The system is deployed on Azure and all the dependencies are handled by Terraform. The system can be updated and maintained using the Ansible playbooks.

- This project assumes that the user has an Azure subscription, and has access to Azure resources and permissions to provision resources. Additionally, the user should have a basic knowledge of Ansible and Terraform and should have them installed on the local machine.

## Architecture:
The overall architecture of this project consists of three main components:

- **Linux VM on Azure**: The Linux VM on Azure serves as the primary server for the web application. This VM is provisioned using Terraform, and is configured with all the necessary dependencies and software.

- **Ansible**: Ansible is used as the configuration management tool in this project. It is used to automate tasks and manage the configuration of the Linux VM on Azure. Ansible playbooks are used to define the desired state of the system and apply the necessary changes.

- **Terraform**: Terraform is used to provision the Linux VM on Azure. It is used to define the Azure resources required for the system and to automate the process of creating and configuring the resources.

The system is designed to be highly available, secure, and easily scalable. Terraform is used to create and manage the infrastructure on Azure and Ansible is used to configure and manage the Linux VM. The system can be easily updated and maintained using the Ansible playbooks.

The following diagram illustrates the architecture of the system:

![ansible project](https://user-images.githubusercontent.com/105864615/215081294-90b126d0-1f47-4ecc-b29a-35edc5af688d.jpg)

The Linux VM on Azure is provisioned using Terraform and configured using Ansible. The system can be easily updated and maintained using the Ansible playbooks.

## Tools and Technologies:
This project uses the following tools and technologies:

1. **Ansible**: Ansible is an open-source configuration management tool that can be used to automate the deployment and management of software on multiple servers. In this project, Ansible is used to manage the configuration of the Linux VM on Azure.

2. **Terraform**: Terraform is an open-source infrastructure as code software tool that allows to create, manage and provision infrastructure resources through code. In this project, Terraform is used to provision the Linux VM on Azure and manage the infrastructure resources on Azure.

3. **Azure**: Azure is a cloud computing service created by Microsoft for building, deploying, and managing applications and services through a global network of Microsoft-managed data centers. In this project, Azure is used as the cloud platform to provision the Linux VM and manage the infrastructure resources.

4. **Linux**: The project uses Linux as the operating system for the virtual machine.

5. **Apache** : Apache is a free and open-source web server software. It supports a variety of programming languages and protocols, including PHP, Perl, Python, and Ruby, as well as the HTTP and HTTPS protocols. It also supports a wide range of operating systems, including Windows, MacOS, and Linux. Apache can be configured and customized to meet the needs of different web sites and applications.

These tools and technologies are widely used in the industry and are well-documented, making it easy to find resources and tutorials for learning and troubleshooting.

## Setup and Installation: 

**Install Terraform** : To install Terraform, you will need to download the appropriate package for your operating system from the Terraform website. Once you have downloaded the package, you can install Terraform using the package manager of your choice or by following the instructions provided in the Terraform documentation.(here my local machine is Ubuntu:20.04)
  ```
  wget https://releases.hashicorp.com/terraform/0.15.5/terraform_0.15.5_linux_amd64.zip
  unzip terraform_0.15.5_linux_amd64.zip
  sudo mv terraform /usr/local/bin/
  ```
**Install Ansible**: To begin using Ansible as a means of managing our server infrastructure, we need to install the Ansible software on the machine that will serve as the Ansible control node. run the following command to include the official project’s PPA (personal package archive) in your system’s list of sources, Refresh your system’s package index, then we can install the Ansible software.
  ```
  sudo apt-add-repository ppa:ansible/ansible
  sudo apt update
  sudo apt install ansible
  ```
## Provisioning a Linux VM on Azure using Terraform:
This is a Terraform configuration file that creates resources in Azure using the Azure Resource Manager (azurerm) provider. The resources being created include a resource group, virtual network, subnet, network security group, public IP, network interface, and a Linux virtual machine.
  ```
  terraform {
    required_providers {
      azurerm = {
        source = "hashicorp/azurerm"
        version = "3.40.0"
      }
    }
  }

  provider "azurerm" {
    # Configuration options
  }

  resource "azurerm_resource_group" "rg" {
    name     = "myResourceGroup"
    location = "East US"
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

  resource "azurerm_network_security_group" "secure_grp" {
    name                = "securitygroup"
    location            = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name

    security_rule {
      name                       = "SSH"
      priority                   = 300
      direction                  = "Inbound"
      access                     = "Allow"
      protocol                   = "Tcp"
      source_port_range          = "*"
      destination_port_range     = "22"
      source_address_prefix      = "*"
      destination_address_prefix = "*"
    }
    security_rule {
      name                       = "HTTP"
      priority                   = 400
      direction                  = "Inbound"
      access                     = "Allow"
      protocol                   = "Tcp"
      source_port_range          = "*"
      destination_port_range     = "80"
      source_address_prefix      = "*"
      destination_address_prefix = "*"
    }
  }

  resource "azurerm_subnet_network_security_group_association" "secure_grp_assos" {
    subnet_id                 = azurerm_subnet.subnet.id
    network_security_group_id = azurerm_network_security_group.secure_grp.id
  }

  resource "azurerm_public_ip" "pub_ip" {
    name                = "publicip"
    resource_group_name = azurerm_resource_group.rg.name
    location            = azurerm_resource_group.rg.location
    allocation_method   = "Static"

  }
  resource "azurerm_network_interface" "nic" {
    name                = "myNIC"
    location            = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name

    ip_configuration {
      name                          = "myIPConfig"
      subnet_id                     = azurerm_subnet.subnet.id
      private_ip_address_allocation = "dynamic"
      public_ip_address_id = azurerm_public_ip.pub_ip.id
    }
  }


  resource "tls_private_key" "tls" {
    algorithm = "RSA"
  }

  resource "local_file" "private_key" {
    content  = tls_private_key.tls.private_key
    filename = "private_rsa"
  }

  resource "local_file" "public_key" {
    content  = tls_private_key.tls.public_key_openssh
    filename = "public_rsa.pub"
  }

  resource "azurerm_linux_virtual_machine" "vm" {
    name                = "linux-machine"
    resource_group_name = azurerm_resource_group.rg.name
    location            = azurerm_resource_group.rg.location
    size                = "Standard_F2"
    admin_username      = "adminuser"
    network_interface_ids = [
      azurerm_network_interface.nic.id,
    ]

    admin_ssh_key {
      username   = "adminuser"
      public_key = tls_private_key.tls.public_key_openssh
    }

    os_disk {
      caching              = "ReadWrite"
      storage_account_type = "Standard_LRS"
    }

    source_image_reference {
      publisher = "Canonical"
      offer     = "UbuntuServer"
      sku       = "22.04-LTS"
      version   = "latest"
    }
  }

  resource "null_resource" "ansible" {
    provisioner "local-exec" {
      command = "ansible-playbook -i '${azurerm_linux_virtual_machine.vm.public_ip_address},' playbook.yaml --private-key=private_rsa"
    }
  }
  ```
- The code first sets the version of the azurerm provider to be used, and then configures the provider with options.

- The code then creates an Azure resource group named "myResourceGroup" in the East US location.

- Next, it creates a virtual network named "myVnet" with an address space of "10.0.0.0/16" and associates it with the previously created resource group.

- Then, it creates a subnet named "mySubnet" within the virtual network and assigns it the address prefix "10.0.1.0/24".

- The code then creates a network security group named "securitygroup" and associates it with the resource group. The security group has two rules, one for allowing inbound SSH traffic and the other for allowing inbound HTTP traffic.

- The code creates a subnet_network_security_group_association to associate the subnet with the security group.

- The code creates a public IP address object named "publicip" and associates it with the resource group.

- The code creates a network interface card (NIC) named "myNIC" and associates it with the resource group, subnet and public IP address.

- The code then creates a private and public key pair using the tls_private_key resource, and writes the private key to a file named "private_rsa" and the public key to a file named "public_rsa.pub".

- Finally, the code creates a Linux virtual machine named "linux-machine" in the resource group, and associates it with the previously created NIC, and sets admin_username and admin_ssh_key to access the virtual machine. The virtual machine uses UbuntuServer 22.04-LTS as an image.

- There is also a null_resource named "ansible" that runs an ansible-playbook command on the local machine that connects to the virtual machine using the public IP address, the private key and a playbook file named "playbook.yaml"

## Configuration Management using Ansible:

playbook.yaml
```
  ---
  - name: Install and configuring Apache web server  
    hosts: all
    become: true
    tasks:
    - name: Install Apache web server
      apt:
        name: apache2
        state: latest
    - name: Copy HTML file to server
      copy:
        src: web-page/*
        dest: /var/www/html/
    - name: Enable Apache service
      service:
        name: apache2
        state: started
        enabled: true
    - name: Open port 80
      firewalld:
        service: http
        state: enabled
        permanent: true
    - name: Restart Firewall
      service:
        name: firewall
        state: restarted
  ```
This is a playbook written in YAML for Ansible. It is used to automate the installation and configuration of Apache web server on a target host or hosts.

The playbook is divided into several tasks.

- The first task installs the Apache web server package using the apt module, which is used to manage packages on Ubuntu and Debian systems.

- The second task copies the contents of a directory called "web-page" to the /var/www/html/ directory on the target host. This is where Apache serves web pages by default.

- The third task uses the service module to start the Apache service and enable it to start automatically at boot time.

- The fourth task opens port 80 on the host's firewall using the firewalld module. It also sets the service to "http" and makes the change permanent.

- The fifth task restarts the firewall service to apply the changes.

## Execution and Deployment: 

Once the necessary tools, dependencies, and configuration files have been set up and configured, the project can be executed and deployed. The following are the steps to be followed for execution and deployment:

💻 **Provision the Linux VM on Azure**: The Linux VM on Azure can be provisioned using Terraform by running the **terraform apply** command. This command will create the necessary resources on Azure according to the Terraform configuration files.

📄 **Execute the Ansible playbooks**: After the Linux VM on Azure has been provisioned, the Ansible playbooks can be executed by running the ansible-playbook command, which is done by terraform as part of excution of null_resource. The playbooks will be executed on the target host and will configure the Linux VM according to the desired state defined in the playbooks.

🌐 **Deploy the HTML page**: Once the Web server has been configured, the HTML page can be deployed on top of apache web server by copying the necessary files to the appropriate location on the Linux VM.

✔️ **Verify the deployment**: After the HTML page has been deployed, the deployment can be verified by accessing the page on a web browser and ensuring that it is displayed correctly or We can execute following ansible playbook.

  ```
  - name: Install and configuring Apache web server  
      hosts: all
      become: true
      tasks:
      - name: Check Apache status
        shell: systemctl status apache2
      - name: curl to check if HTML page is served
        shell: curl http://localhost
  ```

🛠️ **Update and maintain the system**: The system can be easily updated and maintained by running the appropriate Terraform and Ansible commands. This allows for easy scaling and updating of the system.

## Maintenance and Updates: 

Once the project is deployed, it will require regular maintenance and updates to ensure that it remains secure, stable, and up-to-date. The following are some steps that should be taken to maintain and update the project:

👨‍🔧 **Monitor the system**: Regularly monitor the system to ensure that it is running smoothly and to identify any potential issues. This can be done using built-in monitoring tools or third-party monitoring solutions.

👨‍🔧 **Apply security patches and updates**: Regularly apply security patches and updates to the Linux VM, Apache, and other components of the system to ensure that it remains secure.

👨‍🔧 **Update and maintain the infrastructure**: Regularly update and maintain the infrastructure by updating the Terraform configuration files and running the appropriate Terraform commands. This allows for easy scaling and updating of the system.

👨‍🔧 **Update and maintain the configuration**: Regularly update and maintain the configuration by updating the Ansible playbooks and running the appropriate Ansible commands. This allows for easy scaling and updating of the system.

## Troubleshooting:

Despite the best efforts to plan, design and test, issues can still occur in the deployed system. Below are some steps that can be taken to troubleshoot issues with the project:

🕵️ **Check the logs**: The first step in troubleshooting is to check the logs of the system. This can provide valuable information about the issue and help identify the root cause.

🕵️ **Check the Configuration**: Check the configuration of the system, including the Terraform and Ansible configuration files, to ensure that they are correct and that all necessary dependencies are installed.

🕵️ **Check the network**: Check the network connections to ensure that all necessary ports are open and that there are no firewalls blocking traffic.

🕵️ **Check the dependencies**: Ensure that all necessary dependencies are installed and that they are the correct version.

🕵️ **Run the appropriate commands**: Run the appropriate Terraform and Ansible commands to ensure that the system is in the desired state.

- Revert to a previous state: If the issue cannot be resolved, it may be necessary to revert the system to a previous state. This can be done by re-provisioning the system using Terraform.

## Conclusion:

In this project, I have demonstrated how to build a configuration management system using Ansible and provision a Linux VM on Azure using Terraform. I have also shown how to deploy a simple HTML page on top of an apache server running on the Linux VM. This project can serve as a starting point for building more complex and sophisticated systems.

I've highlighted the importance of planning, designing, testing, and documenting the project, as well as the importance of regular maintenance and updates to ensure that the system remains secure, stable, and up-to-date.

I've also discussed the importance of troubleshooting and seeking for help when necessary.

**Overall🔥, the use of configuration management tools like Ansible and infrastructure provisioning tools like Terraform can greatly👑 simplify the process of building and maintaining complex systems, and can make it easier to scale and update the systems as needed.**

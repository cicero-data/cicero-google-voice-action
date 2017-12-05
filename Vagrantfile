# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.require_version ">= 1.8"

CICERO_VOICE_SHARED_FOLDER_TYPE = ENV.fetch("CICERO_VOICE_SHARED_FOLDER_TYPE", "nfs")
if CICERO_VOICE_SHARED_FOLDER_TYPE == "nfs"
  if Vagrant::Util::Platform.linux? then
    CICERO_VOICE_MOUNT_OPTIONS = ['rw', 'vers=3', 'tcp', 'nolock']
  else
    CICERO_VOICE_MOUNT_OPTIONS = ['vers=3', 'udp']
  end
else
  if ENV.has_key?("CICERO_VOICE_MOUNT_OPTIONS")
    CICERO_VOICE_MOUNT_OPTIONS = ENV.fetch("CICERO_VOICE_MOUNT_OPTIONS").split
  else
    CICERO_VOICE_MOUNT_OPTIONS = ["rw"]
  end
end

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.synced_folder "~/.aws", "/home/vagrant/.aws"

  # Need to use NFS else Vagrant locks up on OSX
  config.vm.synced_folder ".", "/vagrant", type: CICERO_VOICE_SHARED_FOLDER_TYPE, mount_options: CICERO_VOICE_MOUNT_OPTIONS

  config.vm.provider :virtualbox do |vb|
    vb.memory = 1024
    vb.cpus = 2
  end

  # NFS
  config.vm.network "private_network", ip: "192.168.10.100"

  # Serverless
  config.vm.network :forwarded_port, guest: 3000, host: 3000

  # Change working directory to /vagrant upon session start.
  config.vm.provision "shell", inline: <<SCRIPT
    if ! grep -q "cd /vagrant" "/home/vagrant/.bashrc"; then
        echo "cd /vagrant" >> "/home/vagrant/.bashrc"
    fi
SCRIPT

  config.vm.provision "ansible" do |ansible|
      ansible.playbook = "deployment/ansible/cicero_voice.yml"
      ansible.galaxy_role_file = "deployment/ansible/roles.yml"
  end
end

class AddAttachmentAvatarToTests < ActiveRecord::Migration
  def self.up
    change_table :tests do |t|
      t.attachment :avatar
    end
  end

  def self.down
    drop_attached_file :tests, :avatar
  end
end

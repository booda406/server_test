class Product < ActiveRecord::Base
	mount_uploader :image, ImageUploader

 before_save :update_images_attributes

  def update_images_attributes
      self.file_size = image.file.size
  end

end

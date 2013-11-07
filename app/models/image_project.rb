class ImageProject < ActiveRecord::Base
	#attr_accessible :framework, :name, :project_images_attributes

  has_many :project_images, class_name: 'ProjectImage', dependent: :destroy

  accepts_nested_attributes_for :project_images
end

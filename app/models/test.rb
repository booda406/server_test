class Test < ActiveRecord::Base
	attr_accessor :avatar_data

	has_attached_file :avatar, :styles => { medium: ["300x300>", :png], thumb: ["100x100>", :png]}
	belongs_to :project
	before_save :decode_avatar_data

	def decode_avatar_data
    # If image_data is present, it means that we were sent an image over
    # JSON and it needs to be decoded.  After decoding, the image is processed
    # normally via Paperclip.
     if self.avatar_data.present?
        data = StringIO.new(Base64.decode64(self.avatar_data))
        data.class.class_eval {attr_accessor :original_filename, :content_type}
        data.original_filename = self.id.to_s + ".png"
        data.content_type = "image/png"

        self.image = data
     end
  	end

end

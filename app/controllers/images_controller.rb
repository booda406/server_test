class ImagesController < ApplicationController
	def upload
		@imgae = Image.new(image_params)
	end

	private

	def image_params
		params.require(:images).permit(:image, :post_id)
	end
end

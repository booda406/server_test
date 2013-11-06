class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update, :destroy]
 # before_action :authenticate_user!

  # GET /products
  # GET /products.json
  def index
    @products = Product.all
  end

  # GET /products/1
  # GET /products/1.json
  def show
  end

  # GET /products/new
  def new
    @product = Product.new
  end

  # GET /products/1/edit
  def edit
  end

  # POST /products
  # POST /products.json
  def create
    @product = Product.new(product_params)

  respond_to do |format|
      format.json {
 #create a new image so that you can call it's class method (a bit hacky, i know)
        @product = Image.new
#get the json image data
        pixels = params[:image]
#convert it from hex to binary
      pixels = @product.hex_to_string(pixels)
#create it as a file
        data = StringIO.new(pixels)
#set file types
        data.class.class_eval { attr_accessor :original_filename, :content_type }
        data.original_filename = "test1.jpeg"
        data.content_type = "image/jpeg"
#set the image id, had some weird behavior when i didn't
        @product.id = Image.count + 1
#upload the data to Amazon S3
       # @image.upload(data)
#save the image
        if @product.save!
          render :nothing => true
        end
      }
    end

    respond_to do |format|
      if @product.save
        format.html { redirect_to @product, notice: 'Product was successfully created.' }
        format.json { render action: 'show', status: :created, location: @product }
      else
        format.html { render action: 'new' }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /products/1
  # PATCH/PUT /products/1.json
  def update
    respond_to do |format|
      if @product.update(product_params)
        format.html { redirect_to @product, notice: 'Product was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/1
  # DELETE /products/1.json
  def destroy
    @product.destroy
    respond_to do |format|
      format.html { redirect_to products_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def product_params
      params.require(:product).permit(:name, :description, :image)
    end
    #stores the file
  def upload(file)
    self.path.store!(file)
  end
  
#converts the data from hex to a string -> found code here http://4thmouse.com/index.php/2008/02/18/converting-hex-to-binary-in-4-languages/
  def hex_to_string(hex)
  temp = hex.gsub("\s", "");
    ret = []
    (0...temp.size()/2).each{|index| ret[index] = [temp[index*2, 2]].pack("H2")}
    file = String.new
    ret.each { |x| file << x}
    file  
  end
end

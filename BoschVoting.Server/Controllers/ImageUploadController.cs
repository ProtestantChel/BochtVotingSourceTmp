using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp4.Server.Models;
using System.Text;

namespace ReactApp4.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageUploadController : ControllerBase
    {
        public static IWebHostEnvironment _environment;

        public ImageUploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public class FileUploadAPI
        {
            public IFormFile files { get; set; }
        }

        [HttpPost]
        [Route("image")]
        public string uploadFile(FileUploadAPI objFile)
        {
            try
            {
                if (objFile.files.Length > 0)
                {
                    if (!Directory.Exists(_environment.WebRootPath + "\\image\\"))
                    {
                        Directory.CreateDirectory(_environment.WebRootPath + "\\image\\");
                    } else
                    {
                        DirectoryInfo di = new DirectoryInfo(_environment.WebRootPath + "\\image\\");
                        foreach (FileInfo file in di.GetFiles())
                        {
                            file.Delete();
                        }
                        foreach (DirectoryInfo dir in di.GetDirectories())
                        {
                            dir.Delete(true);
                        }
                    }
                    using (FileStream fileStream = System.IO.File.Create(_environment.WebRootPath + "\\image\\" + objFile.files.FileName))
                    {
                        objFile.files.CopyTo(fileStream);
                        fileStream.Flush();

                        new Thread(() =>
                        {
                            try
                            {
                                byte[] bytes = Encoding.UTF8.GetBytes(objFile.files.FileName);
                                FileStream file = System.IO.File.Create("infoImage.txt");
                                file.Write(bytes, 0, bytes.Length);
                                file.Close();

                            }
                            catch
                            {

                            }

                        }).Start();

                        return _environment.WebRootPath + "\\image\\" + objFile.files.FileName;
                    }

                } else
                {
                    return "";
                }
            }
            catch (Exception ex)
            {

                return ex.Message.ToString();
            }
        }
        [HttpGet]
        [Route("info")]
        public string getInfo()
        {
            try
            {
                return System.IO.File.ReadAllText("infoImage.txt");

            }
            catch (FileNotFoundException f)
            {
                Console.WriteLine(f.Message);

            }
            return "";
        }

    }
}

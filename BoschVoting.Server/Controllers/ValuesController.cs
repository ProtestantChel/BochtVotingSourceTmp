using BoschVoting.Server.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ReactApp4.Server.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Xml.Serialization;
using static System.Runtime.InteropServices.JavaScript.JSType;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ReactApp4.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {

        [EnableCors("AnotherPolicy")]
        [HttpPost]
        [Route("seatInfo")]
        public IList<SeatInfo> seatInfo(IList<SeatInfo> seatInfo)
        {
            return seatInfo;
        }

        [HttpGet]
        [Route("seatCanvas")]
        public IList<SeatCanvas> getSeatCanvas()
        {
            try
            {
                string array = System.IO.File.ReadAllText("seatCanvas.json");
                if (array != null && array != "")
                {
                    var list = JsonSerializer.Deserialize<List<SeatCanvas>>(array);
                    if (list != null)
                    {
                        return list;
                    }

                }
            } catch (FileNotFoundException f) {
                Console.WriteLine(f.Message);

            }
            return new List<SeatCanvas>();
        }
        
        [HttpPost]
        [Route("seatCanvas")]
        public IList<SeatCanvas> seatCanvas(List<SeatCanvas> seatCanvas)
        {
            new Thread(() =>
            {
                try
                {
                    if (seatCanvas != null)
                    {
                        if (seatCanvas.Count >= 0)
                        {
                            byte[] bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(seatCanvas));
                            FileStream file = System.IO.File.Create("seatCanvas.json");
                            file.Write(bytes, 0, bytes.Length);
                            file.Close();
                        }
                        else
                        {


                        }
                    }

                }
                catch
                {

                }

            }).Start();
            return seatCanvas;
        }

        [HttpGet]
        [Route("seatList")]
        public IList<SeatList> getSeatList()
        {
            try
            {
                string array = System.IO.File.ReadAllText("SeatList.json");
                if (array != null && array != "")
                {
                    var list = JsonSerializer.Deserialize<List<SeatList>>(array);
                    if (list != null)
                    {
                        return list;
                    }

                }

            } catch (FileNotFoundException f) {
                Console.WriteLine(f.Message);

            }

            return new List<SeatList>();
        }

        [HttpPost]
        [Route("seatList")]
        public IList<SeatList> seatList(List<SeatList> seatList)
        {
            new Thread(() =>
            {
                try
                {
                    if (seatList != null)
                    {
                        if (seatList.Count >= 0)
                        {
                            byte[] bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(seatList));
                            FileStream file = System.IO.File.Create("SeatList.json");
                            file.Write(bytes, 0, bytes.Length);
                            file.Close();
                        }
                        else
                        {


                        }
                    }

                }
                catch
                {

                }

            }).Start();
            return seatList;
        }

        [HttpGet]
        [Route("seats")]
        public IList<SeatList> getSeats()
        {
            try
            {
                string array = System.IO.File.ReadAllText("Seats.json");
                if (array != null && array != "")
                {
                    var list = JsonSerializer.Deserialize<List<SeatList>>(array);
                    if (list != null)
                    {
                        return list;
                    }

                }
            }
            catch (FileNotFoundException f)
            {
                Console.WriteLine(f.Message);

            }
            return new List<SeatList>();
        }

        [HttpPost]
        [Route("seats")]
        public IList<SeatList> seats(List<SeatList> seatList)
        {
            new Thread(() =>
            {
                try
                {
                    if (seatList != null)
                    {
                        if (seatList.Count >= 0)
                        {
                            byte[] bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(seatList));
                            FileStream file = System.IO.File.Create("Seats.json");
                            file.Write(bytes, 0, bytes.Length);
                            file.Close();
                        }
                        else
                        {


                        }
                    }

                }
                catch
                {

                }

            }).Start();
            return seatList;
        }

        [HttpGet]
        [Route("participantsList")]
        public IList<Participants> getParticipantsList()
        {
            try
            {
                string array = System.IO.File.ReadAllText("Participants.json");
                if (array != null && array != "")
                {
                    var list = JsonSerializer.Deserialize<List<Participants>>(array);
                    if (list != null)
                    {
                        return list;
                    }

                }
            }
            catch (FileNotFoundException f)
            {
                Console.WriteLine(f.Message);

            }
            return new List<Participants>();
        }

        [HttpGet]
        [Route("participantsTitle")]
        public string getParticipantsTitle()
        {
            try
            {
                return System.IO.File.ReadAllText("title.ini");
            }
            catch (FileNotFoundException f)
            {
                Console.WriteLine(f.Message);

            }
            return "";
        }
        [HttpGet]
        [Route("configure")]
        public Configure getConfigure()
        {
            try
            {
                XmlSerializer xmlSerializer = new XmlSerializer(typeof(Configure));

                using (FileStream fs = new FileStream("ini.xml", FileMode.OpenOrCreate))
                {
                    Configure? configure = xmlSerializer.Deserialize(fs) as Configure;
                    if (configure != null)
                        return configure;
                }

            }
            catch (Exception f)
            {
                Console.WriteLine(f.Message);

            }
            return new Configure();
        }
        [HttpPost]
        [Route("participantsList")]
        public IList<Participants> participantsList(List<Participants> participants)
        {
            Console.WriteLine(participants);
            new Thread(() =>
            {
                try
                {
                    if (participants != null)
                    {
                        if (participants.Count >= 0)
                        {
                            byte[] bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(participants));
                            FileStream file = System.IO.File.Create("Participants.json");
                            file.Write(bytes, 0, bytes.Length);
                            file.Close();
                        }
                        else
                        {


                        }
                    }

                }
                catch
                {

                }

            }).Start();
            return participants;
        }
    }
}
